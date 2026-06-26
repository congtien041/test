const DB_NAME = 'anhshare-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

const state = {
  images: [],
  search: '',
};

const elements = {
  form: document.querySelector('#uploadForm'),
  fileInput: document.querySelector('#imageInput'),
  captionInput: document.querySelector('#captionInput'),
  tagInput: document.querySelector('#tagInput'),
  dropZone: document.querySelector('#dropZone'),
  status: document.querySelector('#uploadStatus'),
  gallery: document.querySelector('#galleryGrid'),
  empty: document.querySelector('#emptyState'),
  template: document.querySelector('#imageCardTemplate'),
  search: document.querySelector('#searchInput'),
  exportButton: document.querySelector('#exportButton'),
  shareDialog: document.querySelector('#shareDialog'),
  shareContent: document.querySelector('#shareContent'),
  totalImages: document.querySelector('#totalImages'),
  totalSize: document.querySelector('#totalSize'),
  totalTags: document.querySelector('#totalTags'),
  themeToggle: document.querySelector('#themeToggle'),
};

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
  });
}

async function withStore(mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const result = callback(store);
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
  }).finally(() => db.close());
}

function readAllImages() {
  return withStore('readonly', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
      request.onerror = () => reject(request.error);
    });
  });
}

function saveImage(image) {
  return withStore('readwrite', (store) => store.put(image));
}

function removeImage(id) {
  return withStore('readwrite', (store) => store.delete(id));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function parseTags(value) {
  return value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 8);
}

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function matchesSearch(image) {
  const query = state.search.toLowerCase();
  if (!query) return true;
  return [image.name, image.caption, ...image.tags].join(' ').toLowerCase().includes(query);
}

function renderStats() {
  const tags = new Set(state.images.flatMap((image) => image.tags));
  const size = state.images.reduce((total, image) => total + image.size, 0);
  elements.totalImages.textContent = state.images.length;
  elements.totalSize.textContent = formatBytes(size);
  elements.totalTags.textContent = tags.size;
}

function renderGallery() {
  elements.gallery.innerHTML = '';
  const images = state.images.filter(matchesSearch);
  elements.empty.style.display = images.length ? 'none' : 'block';

  images.forEach((image) => {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const img = card.querySelector('img');
    img.src = image.dataUrl;
    img.alt = image.caption || image.name;
    card.querySelector('h3').textContent = image.name;
    card.querySelector('.caption').textContent = image.caption || 'Chưa có mô tả';
    card.querySelector('.meta').textContent = `${formatBytes(image.size)} • ${new Date(image.createdAt).toLocaleString('vi-VN')}`;

    const tagList = card.querySelector('.tag-list');
    image.tags.forEach((tag) => {
      const tagElement = document.createElement('span');
      tagElement.textContent = `#${tag}`;
      tagList.append(tagElement);
    });

    card.querySelector('.share-button').addEventListener('click', () => shareImage(image));
    card.querySelector('.download-button').addEventListener('click', () => downloadImage(image));
    card.querySelector('.delete-button').addEventListener('click', () => deleteImage(image.id));
    elements.gallery.append(card);
  });

  renderStats();
}

async function refresh() {
  state.images = await readAllImages();
  renderGallery();
}

async function handleUpload(event) {
  event.preventDefault();
  const files = [...elements.fileInput.files].filter((file) => file.type.startsWith('image/'));
  if (!files.length) {
    elements.status.textContent = 'Vui lòng chọn ít nhất một tệp ảnh.';
    return;
  }

  elements.status.textContent = 'Đang lưu ảnh...';
  const tags = parseTags(elements.tagInput.value);
  const caption = elements.captionInput.value.trim();

  for (const file of files) {
    await saveImage({
      id: crypto.randomUUID(),
      name: file.name,
      caption,
      tags,
      type: file.type,
      size: file.size,
      dataUrl: await fileToDataUrl(file),
      createdAt: Date.now(),
    });
  }

  elements.form.reset();
  elements.status.textContent = `Đã lưu ${files.length} ảnh thành công.`;
  await refresh();
}

async function deleteImage(id) {
  const confirmed = confirm('Bạn có chắc muốn xóa ảnh này khỏi kho?');
  if (!confirmed) return;
  await removeImage(id);
  await refresh();
}

function downloadImage(image) {
  const link = document.createElement('a');
  link.href = image.dataUrl;
  link.download = image.name;
  link.click();
}

async function shareImage(image) {
  const shareText = `${image.caption || image.name}\nThẻ: ${image.tags.join(', ') || 'Không có'}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: image.name, text: shareText });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  elements.shareContent.innerHTML = `
    <img class="share-preview" src="${image.dataUrl}" alt="${image.caption || image.name}" />
    <h2>${image.name}</h2>
    <p>${shareText}</p>
    <div class="copy-field">
      <input value="${image.dataUrl}" readonly aria-label="Dữ liệu ảnh để chia sẻ" />
      <button class="primary-button" type="button">Sao chép</button>
    </div>
  `;
  const input = elements.shareContent.querySelector('input');
  elements.shareContent.querySelector('button').addEventListener('click', async () => {
    await navigator.clipboard.writeText(input.value);
    input.select();
  });
  elements.shareDialog.showModal();
}

function exportSharePackage() {
  if (!state.images.length) {
    elements.status.textContent = 'Chưa có ảnh để xuất gói chia sẻ.';
    return;
  }
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), images: state.images }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `anhshare-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function setupDragAndDrop() {
  ['dragenter', 'dragover'].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove('drag-over');
    });
  });

  elements.dropZone.addEventListener('drop', (event) => {
    elements.fileInput.files = event.dataTransfer.files;
  });
}

function setupTheme() {
  const savedTheme = localStorage.getItem('anhshare-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  elements.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('anhshare-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

elements.form.addEventListener('submit', handleUpload);
elements.search.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderGallery();
});
elements.exportButton.addEventListener('click', exportSharePackage);
setupDragAndDrop();
setupTheme();
refresh().catch((error) => {
  elements.status.textContent = `Không thể mở kho ảnh: ${error.message}`;
});
