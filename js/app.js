/* ============================================================
   TheSkabCode — Blog App by Sourav Karmakar
   ============================================================ */

(() => {
  'use strict';

  // ───── Constants ─────
  const STORAGE_KEY = 'theskabcode_posts';
  const THEME_KEY = 'theskabcode_theme';
  const ACCENT_KEY = 'theskabcode_accent';
  const SUBTITLE_KEY = 'theskabcode_subtitle';
  const BOOKMARKS_KEY = 'theskabcode_bookmarks';
  const VIEWS_KEY = 'theskabcode_views';
  const DRAFT_KEY = 'theskabcode_draft';
  const AUTH_KEY = 'theskabcode_auth';
  const AUTHOR = 'Sourav Karmakar';
  const DRAFT_INTERVAL = 5000;
  const MAX_HISTORY = 100;

  // ───── Config Fragments ─────
  const _0xc = ['\x65\x36\x36\x64\x63\x35\x64\x37\x32\x34\x65\x38\x36\x66\x30\x64',
    '\x65\x61\x37\x31\x37\x63\x64\x64\x35\x66\x35\x62\x61\x64\x34\x61',
    '\x63\x65\x66\x37\x33\x35\x38\x33\x32\x64\x64\x62\x62\x66\x64\x31',
    '\x32\x32\x36\x35\x66\x38\x35\x62\x64\x62\x61\x37\x36\x31\x66\x66'];
  const _0xv = ['\x66\x32\x61\x61\x62\x30\x36\x66\x61\x32\x66\x61\x63\x62\x66\x66\x65\x38\x38\x38\x64\x36\x32\x33\x65\x64\x65\x34\x38\x32\x64\x38',
    '\x61\x31\x66\x33\x32\x62\x64\x63\x37\x66\x63\x36\x39\x62\x66\x33\x64\x37\x62\x61\x35\x61\x32\x35\x37\x30\x39\x39\x64\x38\x34\x66'];

  // ───── Emoji Set ─────
  const EMOJIS = [
    '😀','😂','😍','🤔','😎','🔥','💡','✅','❌','⭐',
    '🚀','💻','📝','📌','🎯','🎉','👍','👎','❤️','💬',
    '⚡','🌟','📖','🔗','🏆','🛠️','📊','🧪','🎨','📱',
    '🤖','🧠','💾','🔒','🌐','📦','🗂️','⏰','🔍','💎',
  ];

  // ───── State ─────
  let posts = [];
  let editingId = null;
  let activeTag = null;

  let confirmCallback = null;
  let draftTimer = null;
  let bookmarks = new Set();
  let viewCounts = {};
  let undoStack = [];
  let redoStack = [];
  let isUndoRedo = false;
  let authUser = null; // { login, avatar_url, token }

  // ───── DOM refs ─────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    heroSection: $('#hero-section'),
    heroStats: $('#hero-stats'),
    heroSubtitle: $('#hero-subtitle'),
    controlsBar: $('#controls-bar'),
    blogList: $('#blog-list'),
    emptyState: $('#empty-state'),
    tagFilterBar: $('#tag-filter-bar'),
    postView: $('#post-view'),
    postViewTitle: $('#post-view-title'),
    postViewMeta: $('#post-view-meta'),
    postViewTags: $('#post-view-tags'),
    postViewCover: $('#post-view-cover'),
    postViewContent: $('#post-view-content'),

    postViewReadbadge: $('#post-view-readbadge'),
    postSeriesNav: $('#post-series-nav'),
    tocNav: $('#toc-nav'),
    postSidebar: $('#post-sidebar'),
    readingProgress: $('#reading-progress'),
    readingProgressFill: $('#reading-progress-fill'),
    editorModal: $('#editor-modal'),
    editorContainer: $('#editor-container'),
    editorTitle: $('#editor-title'),
    inputTitle: $('#input-title'),
    inputTags: $('#input-tags'),

    inputSeries: $('#input-series'),
    inputCover: $('#input-cover'),
    coverName: $('#cover-name'),
    coverPreview: $('#cover-preview'),
    btnRemoveCover: $('#btn-remove-cover'),
    editorTextarea: $('#editor-textarea'),
    previewContent: $('#preview-content'),
    wordCount: $('#word-count'),
    readTime: $('#read-time'),
    searchInput: $('#search-input'),

    toastContainer: $('#toast-container'),
    confirmDialog: $('#confirm-dialog'),
    confirmTitle: $('#confirm-title'),
    confirmMessage: $('#confirm-message'),
    inputInlineImage: $('#input-inline-image'),
    inputImport: $('#input-import'),
    emojiPicker: $('#emoji-picker'),
    cheatsheetPanel: $('#cheatsheet-panel'),
    draftIndicator: $('#draft-indicator'),
    accentDropdown: $('#accent-dropdown'),
    archiveView: $('#archive-view'),
    archiveContent: $('#archive-content'),
    bookmarksView: $('#bookmarks-view'),
    bookmarksContent: $('#bookmarks-content'),

  };

  // ───── Marked Configuration ─────
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
  });

  // ───── Default Blog Posts ─────
  const DEFAULT_POSTS = [
    {
      id: 'birefnet-001',
      title: 'BiRefNet: Bilateral Reference Network for High-Resolution Image Segmentation',
      content: `## What is BiRefNet?

**BiRefNet** (Bilateral Reference Network) is a cutting-edge deep learning architecture designed for **high-resolution dichotomous image segmentation**. It excels at separating foreground objects from backgrounds with pixel-perfect accuracy — even on ultra-high-resolution images.

![BiRefNet Architecture](https://raw.githubusercontent.com/zhengpeng7/BiRefNet/main/assets/BiRefNet.png)

Unlike traditional segmentation models that struggle with fine details like hair strands, lace patterns, or transparent objects, BiRefNet introduces a **bilateral reference mechanism** that processes both global context and local details simultaneously.

---

## Why BiRefNet Matters

Traditional segmentation approaches face a fundamental trade-off:
- **Downsample** the image → lose fine details
- **Process at full resolution** → run out of GPU memory

BiRefNet solves this elegantly with its bilateral architecture:

> BiRefNet maintains two parallel paths — one for semantic understanding and one for boundary refinement — merging them through cross-reference attention.

### Key Advantages
- 🎯 **Pixel-perfect boundaries** on high-res images (4K+)
- ⚡ **Efficient memory usage** through bilateral processing
- 🔥 **State-of-the-art** on DIS5K, HRSOD, and COD benchmarks
- 🖼️ **Handles complex objects** like hair, glass, smoke, and mesh

---

## Architecture Overview

BiRefNet consists of three major components:

### 1. Bilateral Encoder
Processes the input image through two branches:
- **Original Resolution Path** — captures fine-grained boundary details
- **Downsampled Path** — understands global semantics and context

### 2. Cross-Reference Module (CRM)
The magic happens here. CRM enables information exchange between the two branches:

\`\`\`python
class CrossReferenceModule(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.query_conv = nn.Conv2d(channels, channels // 8, 1)
        self.key_conv = nn.Conv2d(channels, channels // 8, 1)
        self.value_conv = nn.Conv2d(channels, channels, 1)
        self.gamma = nn.Parameter(torch.zeros(1))

    def forward(self, high_res, low_res):
        # Generate attention from low-res semantics
        Q = self.query_conv(low_res)
        K = self.key_conv(high_res)
        V = self.value_conv(high_res)

        attention = torch.softmax(Q @ K.transpose(-2, -1), dim=-1)
        refined = self.gamma * (attention @ V) + low_res
        return refined
\`\`\`

### 3. Bilateral Decoder
Progressively merges multi-scale features from both paths to produce the final segmentation mask.

---

## Quick Start: Using BiRefNet

### Installation

\`\`\`bash
git clone https://github.com/zhengpeng7/BiRefNet.git
cd BiRefNet
pip install -r requirements.txt
\`\`\`

### Inference with Pre-trained Model

\`\`\`python
import torch
from torchvision import transforms
from PIL import Image
from models.birefnet import BiRefNet

# Load model
model = BiRefNet(bb_pretrained=False)
state_dict = torch.load('BiRefNet-general-epoch_244.pth', map_location='cpu')
model.load_state_dict(state_dict)
model.eval()

# Prepare image
transform = transforms.Compose([
    transforms.Resize((1024, 1024)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

image = Image.open('input.jpg').convert('RGB')
input_tensor = transform(image).unsqueeze(0)

# Run inference
with torch.no_grad():
    preds = model(input_tensor)[-1].sigmoid().cpu()

# Save result
pred_mask = transforms.ToPILImage()(preds.squeeze())
pred_mask = pred_mask.resize(image.size)
pred_mask.save('output_mask.png')
print("Segmentation complete!")
\`\`\`

### Using with Hugging Face 🤗

\`\`\`python
from transformers import AutoModelForImageSegmentation
import torch
from torchvision import transforms
from PIL import Image

model = AutoModelForImageSegmentation.from_pretrained(
    'zhengpeng7/BiRefNet', trust_remote_code=True
)
model.eval()

image = Image.open('photo.jpg')
transform = transforms.Compose([
    transforms.Resize((1024, 1024)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

input_tensor = transform(image).unsqueeze(0)
with torch.no_grad():
    pred = model(input_tensor)[-1].sigmoid().cpu()

# Apply mask to original image
mask = (pred.squeeze().numpy() * 255).astype('uint8')
\`\`\`

---

## Performance Benchmarks

| Dataset | Metric | BiRefNet | Previous SOTA |
|---------|--------|----------|---------------|
| DIS-VD  | maxFm  | **0.907**| 0.873         |
| DIS-TE1 | MAE    | **0.037**| 0.045         |
| HRSOD   | maxFm  | **0.934**| 0.921         |
| COD10K  | Sm     | **0.891**| 0.882         |

---

## Practical Applications

- **Background Removal** — E-commerce product photos, profile pictures
- **Image Compositing** — Film VFX, creative editing
- **Medical Imaging** — Cell boundary detection, organ segmentation
- **Autonomous Driving** — Precise obstacle boundary detection
- **AR/VR** — Real-time foreground extraction for virtual backgrounds

---

## Conclusion

BiRefNet represents a significant leap in image segmentation quality. Its bilateral approach elegantly solves the resolution-detail trade-off that has plagued segmentation models for years. Whether you're building a background remover or a medical imaging pipeline, BiRefNet delivers the precision you need.

**Links:**
- [GitHub Repository](https://github.com/zhengpeng7/BiRefNet)
- [Paper on arXiv](https://arxiv.org/abs/2401.03407)
- [Hugging Face Model](https://huggingface.co/zhengpeng7/BiRefNet)`,
      tags: ['deep-learning', 'computer-vision', 'segmentation', 'python'],
      pinned: true,
      cover: '',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: null,
    },
    {
      id: 'yolox-002',
      title: 'YOLOX: Pushing the Boundaries of Real-Time Object Detection',
      content: `## Introduction to YOLOX

**YOLOX** is a high-performance, anchor-free object detection model developed by Megvii Technology. It builds upon the legendary YOLO (You Only Look Once) family but introduces several groundbreaking improvements that push real-time detection to new heights.

![YOLOX vs Other Detectors](https://raw.githubusercontent.com/Megvii-BaseDetection/YOLOX/main/assets/git_fig.png)

YOLOX achieves an impressive **50.1% AP** on COCO at 68.9 FPS on a V100 GPU — making it one of the best speed-accuracy trade-off models available.

---

## What Makes YOLOX Special?

### 1. Anchor-Free Design
Unlike YOLOv3/v4/v5 which rely on predefined anchor boxes, YOLOX is **anchor-free**:

\`\`\`
Traditional YOLO:  Input → Backbone → Predict (relative to anchors)
YOLOX:             Input → Backbone → Predict (direct x, y, w, h)
\`\`\`

This simplifies the pipeline, reduces hyperparameters, and improves generalization.

### 2. Decoupled Head
YOLOX separates classification and localization into **two parallel branches**:

\`\`\`python
class DecoupledHead(nn.Module):
    def __init__(self, num_classes, in_channels):
        super().__init__()
        # Classification branch
        self.cls_convs = nn.Sequential(
            nn.Conv2d(in_channels, in_channels, 3, padding=1),
            nn.BatchNorm2d(in_channels),
            nn.SiLU(inplace=True),
            nn.Conv2d(in_channels, in_channels, 3, padding=1),
            nn.BatchNorm2d(in_channels),
            nn.SiLU(inplace=True),
        )
        self.cls_pred = nn.Conv2d(in_channels, num_classes, 1)

        # Regression branch
        self.reg_convs = nn.Sequential(
            nn.Conv2d(in_channels, in_channels, 3, padding=1),
            nn.BatchNorm2d(in_channels),
            nn.SiLU(inplace=True),
            nn.Conv2d(in_channels, in_channels, 3, padding=1),
            nn.BatchNorm2d(in_channels),
            nn.SiLU(inplace=True),
        )
        self.reg_pred = nn.Conv2d(in_channels, 4, 1)
        self.obj_pred = nn.Conv2d(in_channels, 1, 1)

    def forward(self, x):
        cls_feat = self.cls_convs(x)
        cls_output = self.cls_pred(cls_feat)

        reg_feat = self.reg_convs(x)
        reg_output = self.reg_pred(reg_feat)
        obj_output = self.obj_pred(reg_feat)

        return cls_output, reg_output, obj_output
\`\`\`

### 3. SimOTA Label Assignment
YOLOX uses **SimOTA** (Simplified Optimal Transport Assignment) — a dynamic label assignment strategy that automatically determines which predictions should be positive/negative for each ground truth box.

### 4. Strong Data Augmentation
- **Mosaic** — combines 4 images into one
- **MixUp** — blends two images with their labels
- Both disabled in the last 15 epochs for fine-tuning

---

## YOLOX Model Variants

| Model      | Params | FLOPs  | AP (COCO) | FPS (V100) |
|------------|--------|--------|-----------|------------|
| YOLOX-Nano | 0.91M  | 1.08G  | 25.8%     | -          |
| YOLOX-Tiny | 5.06M  | 6.45G  | 32.8%     | -          |
| YOLOX-S    | 9.0M   | 26.8G  | 40.5%     | 102        |
| YOLOX-M    | 25.3M  | 73.8G  | 46.9%     | 81         |
| YOLOX-L    | 54.2M  | 155.6G | 49.7%     | 69         |
| YOLOX-X    | 99.1M  | 281.9G | **50.1%** | 58         |

---

## Getting Started with YOLOX

### Installation

\`\`\`bash
git clone https://github.com/Megvii-BaseDetection/YOLOX.git
cd YOLOX
pip install -v -e .
\`\`\`

### Run Inference

\`\`\`python
from yolox.exp import get_exp
from yolox.utils import get_model_info, postprocess
from yolox.data.data_augment import ValTransform
import torch
import cv2
import numpy as np

# Load model
exp = get_exp(None, "yolox-s")
model = exp.get_model()
ckpt = torch.load("yolox_s.pth", map_location="cpu")
model.load_state_dict(ckpt["model"])
model.eval()

# Prepare image
img = cv2.imread("test.jpg")
preproc = ValTransform(legacy=False)
tensor_img, _ = preproc(img, None, exp.test_size)
tensor_img = torch.from_numpy(tensor_img).unsqueeze(0).float()

# Detect
with torch.no_grad():
    outputs = model(tensor_img)
    outputs = postprocess(
        outputs, exp.num_classes,
        exp.test_conf, exp.nmsthre
    )

# Draw results
if outputs[0] is not None:
    bboxes = outputs[0][:, 0:4].numpy()
    scores = outputs[0][:, 4] * outputs[0][:, 5]
    classes = outputs[0][:, 6].numpy().astype(int)

    for box, score, cls in zip(bboxes, scores, classes):
        x0, y0, x1, y1 = map(int, box)
        cv2.rectangle(img, (x0, y0), (x1, y1), (0, 255, 0), 2)
        cv2.putText(img, f"Class {cls}: {score:.2f}",
                    (x0, y0 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 255, 0), 2)

cv2.imwrite("result.jpg", img)
print(f"Detected {len(bboxes)} objects!")
\`\`\`

### Training on Custom Dataset

\`\`\`python
# Create custom experiment file: my_exp.py
from yolox.exp import Exp as MyExp

class Exp(MyExp):
    def __init__(self):
        super().__init__()
        self.num_classes = 5          # your class count
        self.depth = 0.33             # YOLOX-S depth
        self.width = 0.50             # YOLOX-S width
        self.max_epoch = 100
        self.data_num_workers = 4
        self.eval_interval = 5

        # Data augmentation
        self.mosaic_prob = 1.0
        self.mixup_prob = 1.0
        self.hsv_prob = 1.0
        self.flip_prob = 0.5

        # Dataset paths
        self.data_dir = "datasets/my_data"
        self.train_ann = "train.json"
        self.val_ann = "val.json"
\`\`\`

\`\`\`bash
# Start training
python tools/train.py -f my_exp.py -d 1 -b 16 --fp16
\`\`\`

---

## YOLOX vs YOLOv5 vs YOLOv8

| Feature           | YOLOX      | YOLOv5     | YOLOv8     |
|-------------------|------------|------------|------------|
| Anchor-Free       | ✅         | ❌         | ✅         |
| Decoupled Head    | ✅         | ❌         | ✅         |
| Label Assignment  | SimOTA     | IoU-based  | TaskAlign  |
| Framework         | PyTorch    | PyTorch    | Ultralytics|
| TensorRT Support  | ✅ Native  | ✅ Export   | ✅ Export   |
| Edge Deployment   | ✅ YOLOX-Nano | ✅ YOLOv5n | ✅ YOLOv8n |

---

## Deploying YOLOX with TensorRT

\`\`\`python
# Export to TensorRT for production
import torch
from yolox.exp import get_exp

exp = get_exp(None, "yolox-s")
model = exp.get_model()
model.eval()
model.head.decode_in_inference = False

# Export to ONNX first
dummy_input = torch.randn(1, 3, 640, 640)
torch.onnx.export(
    model, dummy_input, "yolox_s.onnx",
    opset_version=11,
    input_names=["input"],
    output_names=["output"]
)
print("Exported to ONNX! Convert to TensorRT with trtexec.")
\`\`\`

---

## Conclusion

YOLOX remains one of the most practical and efficient object detectors available today. Its anchor-free design, decoupled head, and SimOTA assignment make it both powerful and elegant. Whether you're building a real-time surveillance system or a mobile detection app, YOLOX has a variant that fits your needs.

**Links:**
- [GitHub Repository](https://github.com/Megvii-BaseDetection/YOLOX)
- [Paper on arXiv](https://arxiv.org/abs/2107.08430)`,
      tags: ['deep-learning', 'object-detection', 'yolo', 'python', 'computer-vision'],
      pinned: false,
      cover: '',
      createdAt: Date.now() - 86400000,
      updatedAt: null,
    },
    {
      id: 'rtdetr-003',
      title: 'RT-DETR (RfDETR): The First Real-Time End-to-End Object Detector',
      content: `## What is RT-DETR?

**RT-DETR** (Real-Time Detection Transformer), also known in the community as **RfDETR**, is a revolutionary object detection model from Baidu that brings the power of **transformer-based detection** into the **real-time** domain for the first time.

![RT-DETR Performance](https://user-images.githubusercontent.com/17582080/258122907-0c68e7b5-2ee6-42f3-bce5-2a6b4e0f0a3b.png)

While DETR-family models have shown remarkable accuracy, they've always been too slow for real-time applications. RT-DETR changes this by achieving **54.8% AP on COCO** at **114 FPS** — outperforming all existing YOLO variants in both speed and accuracy.

---

## Why RT-DETR is a Game Changer

Traditional object detectors rely on **Non-Maximum Suppression (NMS)** as a post-processing step:

\`\`\`
YOLO pipeline:    Image → Backbone → Head → NMS → Final Detections
RT-DETR pipeline: Image → Backbone → Transformer Decoder → Final Detections
\`\`\`

> RT-DETR eliminates NMS entirely, making it the first real-time **end-to-end** detector. This removes a major latency bottleneck and simplifies deployment.

### Key Innovations

1. **Efficient Hybrid Encoder** — Combines CNN and Transformer for multi-scale feature processing
2. **IoU-aware Query Selection** — Initializes decoder queries with high-quality proposals
3. **No NMS Required** — True end-to-end detection with set prediction
4. **Flexible Speed Tuning** — Adjust decoder layers at inference without retraining

---

## Architecture Deep Dive

### 1. Hybrid Encoder

RT-DETR's encoder is a masterpiece of efficiency:

\`\`\`python
class HybridEncoder(nn.Module):
    """
    Efficient hybrid encoder combining:
    - Intra-scale interaction (within each feature level)
    - Cross-scale fusion (between feature levels)
    """
    def __init__(self, in_channels=[512, 1024, 2048], hidden_dim=256):
        super().__init__()
        # Input projection
        self.input_proj = nn.ModuleList([
            nn.Sequential(
                nn.Conv2d(c, hidden_dim, 1),
                nn.BatchNorm2d(hidden_dim)
            ) for c in in_channels
        ])

        # Intra-scale: AIFI (Attention-based Intra-scale Feature Interaction)
        self.aifi = TransformerEncoderLayer(
            d_model=hidden_dim,
            nhead=8,
            dim_feedforward=1024,
            dropout=0.0,
            activation='gelu'
        )

        # Cross-scale: CCFM (CNN-based Cross-scale Feature Merging)
        self.ccfm = nn.ModuleList([
            CSPRepLayer(hidden_dim * 2, hidden_dim)
            for _ in range(len(in_channels) - 1)
        ])

    def forward(self, feats):
        # Project all scales to same channel dim
        proj_feats = [proj(f) for proj, f in zip(self.input_proj, feats)]

        # Apply attention only on highest-level features (efficient!)
        proj_feats[-1] = self.aifi(proj_feats[-1])

        # Top-down cross-scale fusion
        for i in range(len(proj_feats) - 1, 0, -1):
            upsampled = F.interpolate(proj_feats[i], scale_factor=2)
            proj_feats[i-1] = self.ccfm[i-1](
                torch.cat([proj_feats[i-1], upsampled], dim=1)
            )

        return proj_feats
\`\`\`

### 2. IoU-aware Query Selection

Instead of random or learned queries, RT-DETR selects the **top-K encoder features** as initial queries based on predicted IoU scores:

\`\`\`python
class QuerySelection(nn.Module):
    def __init__(self, hidden_dim, num_queries=300):
        super().__init__()
        self.num_queries = num_queries
        # Predict objectness + IoU for each encoder feature
        self.score_head = nn.Linear(hidden_dim, 1)

    def forward(self, encoder_features):
        # Score all features
        scores = self.score_head(encoder_features).squeeze(-1)

        # Select top-K as decoder queries
        topk_idx = torch.topk(scores, self.num_queries, dim=1).indices
        queries = torch.gather(
            encoder_features, 1,
            topk_idx.unsqueeze(-1).expand(-1, -1, encoder_features.shape[-1])
        )

        return queries, topk_idx
\`\`\`

### 3. Transformer Decoder with Flexible Layers

\`\`\`python
# The beauty of RT-DETR: tune speed at inference time!
# More layers = higher accuracy, fewer layers = faster speed

model = RTDETR(num_decoder_layers=6)  # Training: 6 layers
model.load_state_dict(checkpoint)

# Fast inference (fewer layers)
model.decoder.num_layers = 3  # ~30% faster, minimal accuracy drop

# Accurate inference (all layers)
model.decoder.num_layers = 6  # Full accuracy
\`\`\`

---

## Model Variants & Performance

| Model       | Backbone    | AP (COCO) | FPS (T4) | Params |
|-------------|-------------|-----------|----------|--------|
| RT-DETR-R18 | ResNet-18   | 46.5%     | **217**  | 20M    |
| RT-DETR-R34 | ResNet-34   | 48.9%     | 161      | 31M    |
| RT-DETR-R50 | ResNet-50   | 53.1%     | 108      | 42M    |
| RT-DETR-R101| ResNet-101  | 54.3%     | 74       | 76M    |
| RT-DETR-L   | HGNetv2     | 53.0%     | 114      | 32M    |
| RT-DETR-X   | HGNetv2     | **54.8%** | 74       | 67M    |

---

## Getting Started

### Installation (via Ultralytics)

\`\`\`bash
pip install ultralytics
\`\`\`

### Inference

\`\`\`python
from ultralytics import RTDETR

# Load pre-trained model
model = RTDETR('rtdetr-l.pt')

# Run inference
results = model('street.jpg')

# Process results
for result in results:
    boxes = result.boxes
    for box in boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        xyxy = box.xyxy[0].tolist()
        print(f"Class: {cls}, Confidence: {conf:.2f}, Box: {xyxy}")

# Save annotated image
results[0].save('result.jpg')
\`\`\`

### Training on Custom Data

\`\`\`python
from ultralytics import RTDETR

model = RTDETR('rtdetr-l.pt')

# Train on custom dataset (YOLO format)
results = model.train(
    data='my_dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    lr0=0.0001,
    weight_decay=0.0001,
    warmup_epochs=3,
    device=0
)

# Evaluate
metrics = model.val()
print(f"mAP50-95: {metrics.box.map}")
\`\`\`

### Dataset YAML format

\`\`\`yaml
# my_dataset.yaml
path: /data/my_dataset
train: images/train
val: images/val
test: images/test

names:
  0: car
  1: person
  2: bicycle
  3: truck
\`\`\`

---

## RT-DETR vs YOLO: Head-to-Head

| Feature              | RT-DETR-L  | YOLOv8-L   | YOLOX-L    |
|----------------------|------------|------------|------------|
| AP (COCO)            | **53.0%**  | 52.9%      | 49.7%      |
| FPS (T4 TensorRT)   | 114        | 110        | 69         |
| NMS Required         | ❌ No      | ✅ Yes      | ✅ Yes      |
| End-to-End           | ✅ Yes     | ❌ No       | ❌ No       |
| Flexible Speed       | ✅ Yes     | ❌ No       | ❌ No       |
| Architecture         | Transformer| CNN        | CNN        |
| Deployment Simplicity| ⭐⭐⭐     | ⭐⭐        | ⭐⭐        |

---

## Export for Production

\`\`\`python
from ultralytics import RTDETR

model = RTDETR('rtdetr-l.pt')

# Export to ONNX
model.export(format='onnx', dynamic=True, simplify=True)

# Export to TensorRT (fastest)
model.export(format='engine', device=0, half=True)

# Export to CoreML (iOS/macOS)
model.export(format='coreml')

print("Model exported successfully!")
\`\`\`

---

## When to Use RT-DETR

✅ **Use RT-DETR when:**
- You need real-time, end-to-end detection without NMS
- Deployment simplicity matters (no NMS tuning)
- You want to trade speed/accuracy at inference time
- You're working with high-accuracy applications

❌ **Consider YOLO when:**
- You need extremely lightweight models (mobile/edge)
- Your framework doesn't support Transformers well
- You need instance segmentation (YOLOv8-seg)

---

## Conclusion

RT-DETR represents a paradigm shift in real-time object detection. By successfully bringing transformers into the real-time domain and eliminating NMS, it opens up new possibilities for cleaner, faster, and more accurate detection pipelines. The ability to flexibly adjust speed-accuracy trade-offs at inference time without retraining is a unique advantage no YOLO model can match.

**Links:**
- [Paper on arXiv](https://arxiv.org/abs/2304.08069)
- [PaddleDetection Implementation](https://github.com/PaddlePaddle/PaddleDetection)
- [Ultralytics RT-DETR Docs](https://docs.ultralytics.com/models/rtdetr/)`,
      tags: ['deep-learning', 'object-detection', 'transformer', 'python', 'computer-vision'],
      pinned: false,
      cover: '',
      createdAt: Date.now(),
      updatedAt: null,
    },
  ];

  // ───── Storage ─────
  function loadPosts() {
    try { posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { posts = []; }
    // Seed default posts if none of them exist yet
    const hasDefaults = DEFAULT_POSTS.some(dp => posts.find(p => p.id === dp.id));
    if (!hasDefaults) {
      posts = [...DEFAULT_POSTS, ...posts];
      savePosts();
    }
  }
  function savePosts() { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }

  function loadBookmarks() {
    try { bookmarks = new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []); } catch { bookmarks = new Set(); }
  }
  function saveBookmarks() { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks])); }

  function loadViews() {
    try { viewCounts = JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; } catch { viewCounts = {}; }
  }
  function saveViews() { localStorage.setItem(VIEWS_KEY, JSON.stringify(viewCounts)); }

  function loadSubtitle() {
    localStorage.removeItem(SUBTITLE_KEY);
  }

  // ───── Auth ─────
  function isAdmin() { return authUser && authUser.isAdmin; }

  function loadAuth() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(AUTH_KEY));
      if (saved && saved.isAdmin) authUser = saved;
    } catch { authUser = null; }
  }
  function saveAuth() { sessionStorage.setItem(AUTH_KEY, JSON.stringify(authUser)); }
  function clearAuth() { authUser = null; sessionStorage.removeItem(AUTH_KEY); }

  function updateAuthUI() {
    const loginBtn = $('#btn-login');
    const adminControls = $('#admin-controls');
    const adminEls = $$('.admin-only');
    if (isAdmin()) {
      loginBtn.style.display = 'none';
      adminControls.style.display = 'flex';
      adminEls.forEach(el => el.style.display = '');
    } else {
      loginBtn.style.display = '';
      adminControls.style.display = 'none';
      adminEls.forEach(el => el.style.display = 'none');
    }
  }

  async function _0xh(s) {
    const d = new TextEncoder().encode(s);
    const b = await crypto.subtle.digest('SHA-256', d);
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  function _0xr(s) { return s.split('').reverse().join(''); }
  async function _0xcheck(input) {
    const h1 = await _0xh(input);
    const ref = _0xc.map(c => _0xr(c)).join('');
    if (h1 !== ref) return false;
    const h2 = await _0xh(h1);
    return h2 === (_0xr(_0xv[0]) + _0xr(_0xv[1]));
  }

  async function loginAsAdmin() {
    const input = prompt('Enter admin password:');
    if (!input) return;
    if (await _0xcheck(input)) {
      authUser = { isAdmin: true };
      saveAuth();
      updateAuthUI();
      toast('Welcome, Admin!', 'success');
    } else {
      toast('Incorrect password', 'error');
    }
  }

  function logout() {
    clearAuth();
    updateAuthUI();
    toast('Logged out', 'info');
  }

  // ───── Theme ─────
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
    updateHljsTheme(saved);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
    updateHljsTheme(next);
    if (window._bgReinit) window._bgReinit();
  }
  function updateThemeIcon(theme) {
    $('#btn-theme i').className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  function updateHljsTheme(theme) {
    $('#hljs-theme').href = theme === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }

  // ───── Accent Color ─────
  function initAccent() {
    const saved = localStorage.getItem(ACCENT_KEY) || 'blue';
    document.documentElement.setAttribute('data-accent', saved);
  }
  function setAccent(color) {
    document.documentElement.setAttribute('data-accent', color);
    localStorage.setItem(ACCENT_KEY, color);
    dom.accentDropdown.style.display = 'none';
  }

  // ───── Utility ─────
  function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function formatMonthYear(ts) {
    return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
  function estimateReadTime(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }
  function getReadBadge(minutes) {
    if (minutes <= 3) return '⚡ Quick Read';
    if (minutes <= 8) return '📖 Medium';
    return '📚 Deep Dive';
  }
  function getExcerpt(markdown, maxLen = 180) {
    const plain = markdown.replace(/[#*_\[\]()>`~|\\-]/g, '').replace(/!\[.*?\]\(.*?\)/g, '');
    return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
  }
  function parseTags(str) { return str.split(',').map(t => t.trim().toLowerCase()).filter(Boolean); }
  function getAllTags() {
    const tagSet = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ───── Toast ─────
  function toast(message, type = 'info') {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type]}"></i> ${message}`;
    dom.toastContainer.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
  }

  // ───── Confirm Dialog ─────
  function showConfirm(title, message, callback) {
    dom.confirmTitle.textContent = title;
    dom.confirmMessage.textContent = message;
    dom.confirmDialog.style.display = 'flex';
    confirmCallback = callback;
  }

  // ───── Sorting ─────
  function sortPosts(arr) {
    const sorted = [...arr].sort((a, b) => b.createdAt - a.createdAt);
    const pinned = sorted.filter(p => p.pinned);
    const unpinned = sorted.filter(p => !p.pinned);
    return [...pinned, ...unpinned];
  }

  // ───── Render Blog List ─────
  function render() {
    const query = dom.searchInput.value.toLowerCase();
    let filtered = posts.filter(p => {
      const matchSearch = !query || p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query) || (p.tags || []).some(t => t.includes(query));
      const matchTag = !activeTag || (p.tags || []).includes(activeTag);
      return matchSearch && matchTag;
    });
    filtered = sortPosts(filtered);

    // Hero stats
    dom.heroStats.innerHTML = `
      <span><i class="fa-solid fa-file-lines"></i> ${posts.length} post${posts.length !== 1 ? 's' : ''}</span>
      <span><i class="fa-solid fa-tags"></i> ${getAllTags().length} tags</span>

    `;

    renderTagBar();

    if (filtered.length === 0) {
      dom.blogList.innerHTML = '';
      dom.emptyState.style.display = 'block';
      if (posts.length > 0 && (query || activeTag)) {
        dom.emptyState.querySelector('h2').textContent = 'No matching posts';
        dom.emptyState.querySelector('p').innerHTML = 'Try a different search or tag filter.';
      } else {
        dom.emptyState.querySelector('h2').textContent = 'No posts yet';
        dom.emptyState.querySelector('p').innerHTML = 'Click <strong>"New Post"</strong> to write your first blog entry.';
      }
    } else {
      dom.emptyState.style.display = 'none';
      dom.blogList.innerHTML = filtered.map(post => {
        const rt = estimateReadTime(post.content);
        const isBookmarked = bookmarks.has(post.id);
        return `
        <div class="blog-card ${post.pinned ? 'pinned' : ''}" data-id="${post.id}">
          ${post.pinned ? '<span class="pin-badge"><i class="fa-solid fa-thumbtack"></i> Pinned</span>' : ''}
          ${isBookmarked ? '<span class="bookmark-badge"><i class="fa-solid fa-bookmark"></i></span>' : ''}
          ${post.cover ? `<img class="blog-card-cover" src="${post.cover}" alt="cover" loading="lazy"/>` : ''}
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span><i class="fa-solid fa-user"></i> ${AUTHOR}</span>
              <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.createdAt)}</span>
              <span><i class="fa-regular fa-clock"></i> ${rt} min</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escapeHtml(getExcerpt(post.content))}</p>
            <div class="blog-card-footer">
              <div class="blog-card-tags">
                ${(post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
              </div>
              <span class="read-badge">${getReadBadge(rt)}</span>
            </div>
          </div>
        </div>`;
      }).join('');
    }
  }

  function renderTagBar() {
    const tags = getAllTags();
    if (tags.length === 0) { dom.tagFilterBar.innerHTML = ''; return; }
    dom.tagFilterBar.innerHTML = `
      <button class="tag-filter ${!activeTag ? 'active' : ''}" data-tag="">All</button>
      ${tags.map(t => `<button class="tag-filter ${activeTag === t ? 'active' : ''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}
    `;
  }

  // ───── View Post ─────
  function viewPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    // Track view count
    viewCounts[id] = (viewCounts[id] || 0) + 1;
    saveViews();

    hideAllSections();
    dom.postView.style.display = 'block';
    dom.readingProgress.style.display = 'block';
    if (window._bgPause) window._bgPause();

    dom.postViewTitle.textContent = post.title;
    const rt = estimateReadTime(post.content);
    dom.postViewMeta.innerHTML = `
      <span><i class="fa-solid fa-user"></i> ${AUTHOR}</span>
      <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.createdAt)}</span>
      ${post.updatedAt ? `<span><i class="fa-solid fa-pen-to-square"></i> Updated ${formatDate(post.updatedAt)}</span>` : ''}
      <span><i class="fa-regular fa-clock"></i> ${rt} min read</span>

    `;
    dom.postViewReadbadge.textContent = getReadBadge(rt);
    dom.postViewTags.innerHTML = (post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    dom.postViewCover.innerHTML = post.cover ? `<img src="${post.cover}" alt="cover"/>` : '';

    const rawHtml = marked.parse(post.content);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    dom.postViewContent.innerHTML = cleanHtml;
    dom.postViewContent.classList.add('post-content');
    addCodeCopyButtons(dom.postViewContent);
    buildToc(dom.postViewContent);
    renderSeriesNav(post);

    // Update pin/bookmark button states
    $('#btn-pin-post').innerHTML = post.pinned
      ? '<i class="fa-solid fa-thumbtack"></i> Unpin'
      : '<i class="fa-solid fa-thumbtack"></i> Pin';
    $('#btn-bookmark-post').innerHTML = bookmarks.has(id)
      ? '<i class="fa-solid fa-bookmark"></i> Bookmarked'
      : '<i class="fa-regular fa-bookmark"></i> Bookmark';

    dom.postView.dataset.postId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ───── Series Navigation ─────
  function renderSeriesNav(post) {
    if (!post.series) { dom.postSeriesNav.style.display = 'none'; return; }
    const seriesPosts = posts
      .filter(p => p.series && p.series.toLowerCase() === post.series.toLowerCase())
      .sort((a, b) => a.createdAt - b.createdAt);
    if (seriesPosts.length <= 1) { dom.postSeriesNav.style.display = 'none'; return; }
    dom.postSeriesNav.style.display = 'block';
    dom.postSeriesNav.innerHTML = `
      <h4><i class="fa-solid fa-layer-group"></i> Series: ${escapeHtml(post.series)}</h4>
      ${seriesPosts.map((p, i) => `
        <span class="series-link ${p.id === post.id ? 'current' : ''}" data-id="${p.id}">
          ${i + 1}. ${escapeHtml(p.title)}
        </span>
      `).join('')}
    `;
  }

  // ───── Table of Contents ─────
  function buildToc(container) {
    const headings = container.querySelectorAll('h1, h2, h3');
    if (headings.length < 2) {
      dom.postSidebar.style.display = 'none';
      return;
    }
    dom.postSidebar.style.display = '';
    let tocHtml = '';
    headings.forEach((h, i) => {
      const id = 'heading-' + i;
      h.id = id;
      const depth = parseInt(h.tagName[1]);
      const depthClass = depth >= 3 ? 'depth-3' : depth === 2 ? 'depth-2' : '';
      tocHtml += `<a class="toc-link ${depthClass}" href="#${id}">${h.textContent}</a>`;
    });
    dom.tocNav.innerHTML = tocHtml;
  }

  // ───── Reading Progress ─────
  function updateReadingProgress() {
    if (dom.postView.style.display === 'none') return;
    const content = dom.postViewContent;
    const rect = content.getBoundingClientRect();
    const contentTop = rect.top + window.scrollY;
    const contentHeight = rect.height;
    const scrolled = window.scrollY - contentTop + window.innerHeight * 0.3;
    const pct = Math.min(100, Math.max(0, (scrolled / contentHeight) * 100));
    dom.readingProgressFill.style.width = pct + '%';
  }

  // ───── Code Copy Buttons ─────
  function addCodeCopyButtons(container) {
    container.querySelectorAll('pre').forEach(pre => {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      const btn = document.createElement('button');
      btn.className = 'btn-copy-code';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        });
      });
      wrapper.appendChild(btn);
    });
  }

  function goHome() {
    hideAllSections();
    dom.heroSection.style.display = '';
    dom.controlsBar.style.display = '';
    dom.blogList.style.display = '';
    if (window._bgResume) window._bgResume();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideAllSections() {
    dom.heroSection.style.display = 'none';
    dom.controlsBar.style.display = 'none';
    dom.blogList.style.display = 'none';
    dom.emptyState.style.display = 'none';
    dom.postView.style.display = 'none';
    dom.readingProgress.style.display = 'none';
    dom.archiveView.style.display = 'none';
    dom.bookmarksView.style.display = 'none';
  }

  // ───── Undo / Redo ─────
  function saveSnapshot() {
    if (isUndoRedo) return;
    const ta = dom.editorTextarea;
    const snapshot = { value: ta.value, start: ta.selectionStart, end: ta.selectionEnd };
    const last = undoStack[undoStack.length - 1];
    if (last && last.value === snapshot.value) return;
    undoStack.push(snapshot);
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
  }
  function undo() {
    if (undoStack.length <= 1) return;
    isUndoRedo = true;
    redoStack.push(undoStack.pop());
    const s = undoStack[undoStack.length - 1];
    dom.editorTextarea.value = s.value;
    dom.editorTextarea.selectionStart = s.start;
    dom.editorTextarea.selectionEnd = s.end;
    updatePreview();
    updateWordCount();
    isUndoRedo = false;
  }
  function redo() {
    if (redoStack.length === 0) return;
    isUndoRedo = true;
    const s = redoStack.pop();
    undoStack.push(s);
    dom.editorTextarea.value = s.value;
    dom.editorTextarea.selectionStart = s.start;
    dom.editorTextarea.selectionEnd = s.end;
    updatePreview();
    updateWordCount();
    isUndoRedo = false;
  }
  function resetHistory() { undoStack = []; redoStack = []; }

  // ───── Auto-save Draft ─────
  function saveDraft() {
    const draft = {
      title: dom.inputTitle.value,
      tags: dom.inputTags.value,
      series: dom.inputSeries.value,
      content: dom.editorTextarea.value,
      cover: dom.coverPreview.dataset.src || '',
      editingId,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    dom.draftIndicator.style.display = 'flex';
    setTimeout(() => { dom.draftIndicator.style.display = 'none'; }, 2000);
  }
  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { return null; }
  }
  function clearDraft() { localStorage.removeItem(DRAFT_KEY); }
  function startDraftTimer() { draftTimer = setInterval(saveDraft, DRAFT_INTERVAL); }
  function stopDraftTimer() { if (draftTimer) { clearInterval(draftTimer); draftTimer = null; } }

  // ───── Editor ─────
  function openEditor(post = null) {
    editingId = post ? post.id : null;
    dom.editorTitle.textContent = post ? 'Edit Post' : 'New Post';

    // Check for draft if creating new
    const draft = !post ? loadDraft() : null;
    if (draft && !draft.editingId && !post) {
      dom.inputTitle.value = draft.title || '';
      dom.inputTags.value = draft.tags || '';
      dom.inputSeries.value = draft.series || '';
      dom.editorTextarea.value = draft.content || '';
      if (draft.cover) {
        dom.coverPreview.innerHTML = `<img src="${draft.cover}" alt="cover"/>`;
        dom.coverPreview.dataset.src = draft.cover;
        dom.coverName.textContent = 'Draft cover';
        dom.btnRemoveCover.style.display = '';
      } else {
        resetCover();
      }
      toast('Draft restored', 'info');
    } else if (post) {
      dom.inputTitle.value = post.title;
      dom.inputTags.value = (post.tags || []).join(', ');
      dom.inputSeries.value = post.series || '';
      dom.editorTextarea.value = post.content;
      if (post.cover) {
        dom.coverPreview.innerHTML = `<img src="${post.cover}" alt="cover"/>`;
        dom.coverPreview.dataset.src = post.cover;
        dom.coverName.textContent = 'Existing cover';
        dom.btnRemoveCover.style.display = '';
      } else {
        resetCover();
      }
    } else {
      dom.inputTitle.value = '';
      dom.inputTags.value = '';
      dom.inputSeries.value = '';
      dom.editorTextarea.value = '';
      resetCover();
    }

    resetHistory();
    updatePreview();
    updateWordCount();
    saveSnapshot();
    dom.emojiPicker.style.display = 'none';
    dom.cheatsheetPanel.style.display = 'none';
    dom.editorModal.style.display = 'flex';
    dom.inputTitle.focus();
    startDraftTimer();
  }

  function resetCover() {
    dom.coverPreview.innerHTML = '';
    dom.coverPreview.dataset.src = '';
    dom.coverName.textContent = 'No image selected';
    dom.btnRemoveCover.style.display = 'none';
    dom.inputCover.value = '';
  }

  function closeEditor() {
    dom.editorModal.style.display = 'none';
    dom.editorContainer.classList.remove('fullscreen');
    editingId = null;
    stopDraftTimer();
  }

  function updatePreview() {
    const raw = marked.parse(dom.editorTextarea.value);
    dom.previewContent.innerHTML = DOMPurify.sanitize(raw);
    dom.previewContent.classList.add('post-content');
    addCodeCopyButtons(dom.previewContent);
  }

  function updateWordCount() {
    const text = dom.editorTextarea.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    dom.wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    dom.readTime.textContent = `${estimateReadTime(text)} min read`;
  }

  function publishPost() {
    const title = dom.inputTitle.value.trim();
    const content = dom.editorTextarea.value.trim();
    const tags = parseTags(dom.inputTags.value);
    const series = dom.inputSeries.value.trim();
    const cover = dom.coverPreview.dataset.src || '';

    if (!title) { toast('Please enter a title', 'error'); dom.inputTitle.focus(); return; }
    if (!content) { toast('Please write some content', 'error'); dom.editorTextarea.focus(); return; }

    if (editingId) {
      const idx = posts.findIndex(p => p.id === editingId);
      if (idx !== -1) {
        posts[idx].title = title;
        posts[idx].content = content;
        posts[idx].tags = tags;
        posts[idx].series = series || undefined;
        posts[idx].cover = cover;
        posts[idx].updatedAt = Date.now();
      }
      toast('Post updated!', 'success');
    } else {
      posts.push({
        id: generateId(),
        title, content, tags,
        series: series || undefined,
        cover,
        pinned: false,
        createdAt: Date.now(),
        updatedAt: null,
      });
      toast('Post published!', 'success');
    }
    savePosts();
    clearDraft();
    closeEditor();
    goHome();
  }

  function deletePost(id) {
    showConfirm('Delete Post', 'This action cannot be undone. Are you sure?', () => {
      posts = posts.filter(p => p.id !== id);
      bookmarks.delete(id);
      delete viewCounts[id];
      savePosts();
      saveBookmarks();
      saveViews();
      toast('Post deleted', 'success');
      goHome();
    });
  }

  function togglePin(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    post.pinned = !post.pinned;
    savePosts();
    toast(post.pinned ? 'Post pinned!' : 'Post unpinned', 'success');
    viewPost(id);
  }

  function toggleBookmark(id) {
    if (bookmarks.has(id)) {
      bookmarks.delete(id);
      toast('Removed from reading list', 'info');
    } else {
      bookmarks.add(id);
      toast('Added to reading list!', 'success');
    }
    saveBookmarks();
    // Update button in view
    $('#btn-bookmark-post').innerHTML = bookmarks.has(id)
      ? '<i class="fa-solid fa-bookmark"></i> Bookmarked'
      : '<i class="fa-regular fa-bookmark"></i> Bookmark';
  }

  // ───── Archive View ─────
  function showArchive() {
    hideAllSections();
    dom.archiveView.style.display = 'block';
    const sorted = [...posts].sort((a, b) => b.createdAt - a.createdAt);
    const grouped = {};
    sorted.forEach(p => {
      const key = formatMonthYear(p.createdAt);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });
    if (Object.keys(grouped).length === 0) {
      dom.archiveContent.innerHTML = '<p style="color:var(--text-muted);">No posts yet.</p>';
      return;
    }
    dom.archiveContent.innerHTML = Object.entries(grouped).map(([month, items]) => `
      <div class="archive-month">
        <h3>${month} (${items.length})</h3>
        ${items.map(p => `
          <div class="archive-item" data-id="${p.id}">
            <span class="archive-item-title">${escapeHtml(p.title)}</span>
            <span class="archive-item-date">${formatDate(p.createdAt)}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // ───── Bookmarks View ─────
  function showBookmarks() {
    hideAllSections();
    dom.bookmarksView.style.display = 'block';
    const items = posts.filter(p => bookmarks.has(p.id));
    if (items.length === 0) {
      dom.bookmarksContent.innerHTML = '<p style="color:var(--text-muted);">No bookmarked posts. Bookmark posts to add them to your reading list.</p>';
      return;
    }
    dom.bookmarksContent.innerHTML = items.map(p => `
      <div class="archive-item" data-id="${p.id}">
        <span class="archive-item-title">${escapeHtml(p.title)}</span>
        <span class="archive-item-date">${formatDate(p.createdAt)}</span>
      </div>
    `).join('');
  }

  // ───── Share ─────
  function copyPostLink(id) {
    const url = window.location.href.split('#')[0] + '#post-' + id;
    navigator.clipboard.writeText(url).then(() => toast('Link copied!', 'success'));
  }
  function shareTwitter(post) {
    const url = window.location.href.split('#')[0] + '#post-' + post.id;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, '_blank');
  }
  function shareLinkedIn(post) {
    const url = window.location.href.split('#')[0] + '#post-' + post.id;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  // ───── Toolbar Actions ─────
  function insertAtCursor(before, after = '') {
    const ta = dom.editorTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    ta.setRangeText(before + selected + after, start, end, 'end');
    ta.focus();
    saveSnapshot();
    updatePreview();
    updateWordCount();
  }

  const toolbarActions = {
    bold: () => insertAtCursor('**', '**'),
    italic: () => insertAtCursor('*', '*'),
    strikethrough: () => insertAtCursor('~~', '~~'),
    h1: () => insertAtCursor('\n# '),
    h2: () => insertAtCursor('\n## '),
    h3: () => insertAtCursor('\n### '),
    ul: () => insertAtCursor('\n- '),
    ol: () => insertAtCursor('\n1. '),
    checklist: () => insertAtCursor('\n- [ ] '),
    link: () => insertAtCursor('[', '](url)'),
    image: () => insertAtCursor('![alt](', ')'),
    code: () => insertAtCursor('`', '`'),
    codeblock: () => insertAtCursor('\n```javascript\n', '\n```\n'),
    blockquote: () => insertAtCursor('\n> '),
    hr: () => insertAtCursor('\n---\n'),
    table: () => insertAtCursor('\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n'),
    underline: () => insertAtCursor('<u>', '</u>'),
    highlight: () => insertAtCursor('<mark>', '</mark>'),
    superscript: () => insertAtCursor('<sup>', '</sup>'),
    subscript: () => insertAtCursor('<sub>', '</sub>'),
    emoji: () => {
      dom.emojiPicker.style.display = dom.emojiPicker.style.display === 'none' ? 'grid' : 'none';
    },
    'inline-image': () => dom.inputInlineImage.click(),
  };

  // ───── Image Handling ─────
  function handleCoverImage(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      dom.coverPreview.innerHTML = `<img src="${e.target.result}" alt="cover"/>`;
      dom.coverPreview.dataset.src = e.target.result;
      dom.coverName.textContent = file.name;
      dom.btnRemoveCover.style.display = '';
    };
    reader.readAsDataURL(file);
  }

  function handleInlineImage(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      insertAtCursor(`\n![${file.name}](${e.target.result})\n`);
      toast('Image inserted!', 'success');
    };
    reader.readAsDataURL(file);
  }

  // ───── HTML to Markdown Converter ─────
  function htmlToMarkdown(html, baseUrl = '') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('script,style,nav,footer,header,iframe,noscript,.ad,.ads,.sidebar,.nav,.footer,.header').forEach(el => el.remove());

    const pageTitle = doc.querySelector('h1')?.textContent?.trim()
      || doc.querySelector('title')?.textContent?.trim() || '';

    const main = doc.querySelector('article') || doc.querySelector('main')
      || doc.querySelector('.content') || doc.querySelector('.post') || doc.body;

    let md = '';
    function resolveUrl(src) {
      if (!src || src.startsWith('data:')) return src;
      if (src.startsWith('http')) return src;
      try { return new URL(src, baseUrl).href; } catch { return src; }
    }

    function walk(node) {
      if (node.nodeType === 3) { md += node.textContent; return; }
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      if (['script','style','nav','footer','header','noscript'].includes(tag)) return;

      if (tag === 'h1') { md += '\n# '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'h2') { md += '\n## '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'h3') { md += '\n### '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'h4') { md += '\n#### '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'h5' || tag === 'h6') { md += '\n##### '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'p' || tag === 'div') { node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'br') { md += '\n'; return; }
      if (tag === 'strong' || tag === 'b') { md += '**'; node.childNodes.forEach(walk); md += '**'; return; }
      if (tag === 'em' || tag === 'i') { md += '*'; node.childNodes.forEach(walk); md += '*'; return; }
      if (tag === 'code') {
        if (node.parentElement?.tagName === 'PRE') return;
        md += '`'; node.childNodes.forEach(walk); md += '`'; return;
      }
      if (tag === 'pre') {
        const code = node.querySelector('code');
        const lang = code?.className?.match(/language-(\w+)/)?.[1] || '';
        md += '\n```' + lang + '\n' + (code || node).textContent.trim() + '\n```\n\n';
        return;
      }
      if (tag === 'a') {
        const href = resolveUrl(node.getAttribute('href') || '');
        md += '['; node.childNodes.forEach(walk); md += `](${href})`;
        return;
      }
      if (tag === 'img') {
        const src = resolveUrl(node.getAttribute('src') || '');
        const alt = node.getAttribute('alt') || 'image';
        if (src) md += `\n![${alt}](${src})\n`;
        return;
      }
      if (tag === 'li') { md += '- '; node.childNodes.forEach(walk); md += '\n'; return; }
      if (tag === 'ul' || tag === 'ol') { md += '\n'; node.childNodes.forEach(walk); md += '\n'; return; }
      if (tag === 'blockquote') { md += '\n> '; node.childNodes.forEach(walk); md += '\n\n'; return; }
      if (tag === 'hr') { md += '\n---\n\n'; return; }
      if (tag === 'table') {
        const rows = node.querySelectorAll('tr');
        rows.forEach((row, ri) => {
          const cells = row.querySelectorAll('th, td');
          md += '| ' + [...cells].map(c => c.textContent.trim()).join(' | ') + ' |\n';
          if (ri === 0) md += '| ' + [...cells].map(() => '---').join(' | ') + ' |\n';
        });
        md += '\n';
        return;
      }
      node.childNodes.forEach(walk);
    }
    walk(main);

    return { title: pageTitle, content: md.replace(/\n{3,}/g, '\n\n').trim() };
  }

  function applyImportedContent(result) {
    if (result.title && !dom.inputTitle.value) dom.inputTitle.value = result.title;
    dom.editorTextarea.value = result.content;
    saveSnapshot();
    updatePreview();
    updateWordCount();
    toast('Content imported! Review and edit as needed.', 'success');
  }

  // ───── Import from URL ─────
  async function importFromUrl() {
    const url = prompt('Enter a URL to import as blog content:');
    if (!url) return;

    toast('Fetching content…', 'info');

    // Try multiple CORS proxies
    const proxies = [
      (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://cors-anywhere.herokuapp.com/${u}`,
      (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
    ];

    for (const proxy of proxies) {
      try {
        const resp = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
        if (resp.ok) {
          const html = await resp.text();
          if (html.length > 100) {
            applyImportedContent(htmlToMarkdown(html, url));
            return;
          }
        }
      } catch { /* try next */ }
    }

    // All proxies failed — show paste modal
    showPasteImportModal(url);
  }

  function showPasteImportModal(url) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay confirm-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
      <div class="confirm-box" style="max-width:550px;">
        <h3><i class="fa-solid fa-paste"></i> Paste Page Content</h3>
        <p style="margin-bottom:0.5rem;">Auto-fetch failed for this URL. Please:</p>
        <ol style="color:var(--text-muted);font-size:0.85rem;margin:0 0 1rem 1.2rem;line-height:1.7;">
          <li>Open <a href="${url}" target="_blank" style="color:var(--accent);">${url.length > 50 ? url.slice(0, 50) + '…' : url}</a> in a new tab</li>
          <li>Press <kbd style="background:var(--bg-input);border:1px solid var(--border);padding:0.1rem 0.4rem;border-radius:3px;font-size:0.8rem;">Ctrl+A</kbd> to select all, then <kbd style="background:var(--bg-input);border:1px solid var(--border);padding:0.1rem 0.4rem;border-radius:3px;font-size:0.8rem;">Ctrl+C</kbd> to copy</li>
          <li>Paste below with <kbd style="background:var(--bg-input);border:1px solid var(--border);padding:0.1rem 0.4rem;border-radius:3px;font-size:0.8rem;">Ctrl+V</kbd></li>
        </ol>
        <textarea id="paste-import-area" style="width:100%;min-height:150px;background:var(--bg-input);border:1px solid var(--border);color:var(--text);padding:0.75rem;border-radius:var(--radius-sm);font-size:0.85rem;resize:vertical;outline:none;" placeholder="Paste the page content here…"></textarea>
        <div class="confirm-actions" style="margin-top:1rem;">
          <button class="btn-secondary" id="paste-cancel">Cancel</button>
          <button class="btn-primary" id="paste-import"><i class="fa-solid fa-file-import"></i> Import</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const area = overlay.querySelector('#paste-import-area');
    area.focus();

    overlay.querySelector('#paste-cancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#paste-import').addEventListener('click', () => {
      const pasted = area.value.trim();
      if (!pasted) { toast('Nothing to import', 'error'); return; }

      // Detect if it's HTML or plain text
      const isHtml = pasted.includes('<') && pasted.includes('>');
      if (isHtml) {
        applyImportedContent(htmlToMarkdown(pasted, url));
      } else {
        // Plain text — use directly as markdown
        if (!dom.inputTitle.value) {
          const firstLine = pasted.split('\n')[0].trim();
          if (firstLine.length < 100) dom.inputTitle.value = firstLine;
        }
        dom.editorTextarea.value = pasted;
        saveSnapshot();
        updatePreview();
        updateWordCount();
        toast('Content imported!', 'success');
      }
      overlay.remove();
    });
  }

  // ───── Pane Expand/Collapse ─────
  function togglePaneExpand(pane) {
    const panes = document.getElementById('editor-panes');
    const editorIcon = $('#btn-expand-editor i');
    const previewIcon = $('#btn-expand-preview i');

    if (pane === 'editor') {
      if (panes.classList.contains('editor-expanded')) {
        panes.classList.remove('editor-expanded');
        editorIcon.className = 'fa-solid fa-up-right-and-down-left-from-center';
      } else {
        panes.classList.remove('preview-expanded');
        panes.classList.add('editor-expanded');
        editorIcon.className = 'fa-solid fa-down-left-and-up-right-to-center';
        previewIcon.className = 'fa-solid fa-up-right-and-down-left-from-center';
      }
    } else {
      if (panes.classList.contains('preview-expanded')) {
        panes.classList.remove('preview-expanded');
        previewIcon.className = 'fa-solid fa-up-right-and-down-left-from-center';
      } else {
        panes.classList.remove('editor-expanded');
        panes.classList.add('preview-expanded');
        previewIcon.className = 'fa-solid fa-down-left-and-up-right-to-center';
        editorIcon.className = 'fa-solid fa-up-right-and-down-left-from-center';
      }
    }
  }

  // ───── Emoji Picker ─────
  function initEmojiPicker() {
    dom.emojiPicker.innerHTML = EMOJIS.map(e =>
      `<button class="emoji-btn" data-emoji="${e}">${e}</button>`
    ).join('');
  }

  // ───── Export / Import ─────
  function exportData() {
    const data = { posts, bookmarks: [...bookmarks], viewCounts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theskabcode-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported!', 'success');
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target.result);
        // Support both old format (array) and new format (object)
        const imported = Array.isArray(raw) ? raw : (raw.posts || []);
        let count = 0;
        imported.forEach(p => {
          if (!posts.some(ep => ep.id === p.id)) { posts.push(p); count++; }
        });
        if (raw.bookmarks) raw.bookmarks.forEach(b => bookmarks.add(b));
        if (raw.viewCounts) Object.assign(viewCounts, raw.viewCounts);
        savePosts();
        saveBookmarks();
        saveViews();
        render();
        toast(`Imported ${count} post(s)!`, 'success');
      } catch {
        toast('Invalid backup file', 'error');
      }
    };
    reader.readAsText(file);
  }

  // ───── Keyboard Shortcuts ─────
  function handleEditorShortcuts(e) {
    if (dom.editorModal.style.display === 'none') return;
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); return; }
      if (e.key === 'y') { e.preventDefault(); redo(); return; }
      if (e.key === 'b') { e.preventDefault(); toolbarActions.bold(); }
      if (e.key === 'i') { e.preventDefault(); toolbarActions.italic(); }
      if (e.key === 'k') { e.preventDefault(); toolbarActions.link(); }
      if (e.key === 'Enter') { e.preventDefault(); publishPost(); }
    }
    if (e.key === 'Escape') closeEditor();
  }

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = start + 2;
      saveSnapshot();
      updatePreview();
    }
  }

  // ───── Deep Link Support ─────
  function handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#post-')) {
      const id = hash.replace('#post-', '');
      if (posts.find(p => p.id === id)) viewPost(id);
    }
  }

  // ───── Event Bindings ─────
  function bindEvents() {
    // Nav
    $('#nav-home').addEventListener('click', goHome);
    $('#btn-theme').addEventListener('click', toggleTheme);
    $('#btn-new-post').addEventListener('click', () => { if (isAdmin()) openEditor(); });
    $('#btn-archive').addEventListener('click', showArchive);
    $('#btn-bookmarks').addEventListener('click', showBookmarks);

    // Auth
    $('#btn-login').addEventListener('click', loginAsAdmin);
    $('#btn-logout').addEventListener('click', logout);

    // Accent picker
    $('#btn-accent').addEventListener('click', () => {
      dom.accentDropdown.style.display = dom.accentDropdown.style.display === 'none' ? 'flex' : 'none';
    });
    dom.accentDropdown.querySelectorAll('.accent-dot').forEach(dot => {
      dot.addEventListener('click', () => setAccent(dot.dataset.accent));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.accent-picker-wrapper')) dom.accentDropdown.style.display = 'none';
    });

    // Search & filters
    dom.searchInput.addEventListener('input', render);

    // Blog list delegation
    dom.blogList.addEventListener('click', (e) => {
      const card = e.target.closest('.blog-card');
      if (card) viewPost(card.dataset.id);
    });

    // Tag filter delegation
    dom.tagFilterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-filter');
      if (!btn) return;
      activeTag = btn.dataset.tag || null;
      render();
    });

    // Archive & bookmarks item click
    dom.archiveContent.addEventListener('click', (e) => {
      const item = e.target.closest('.archive-item');
      if (item) viewPost(item.dataset.id);
    });
    dom.bookmarksContent.addEventListener('click', (e) => {
      const item = e.target.closest('.archive-item');
      if (item) viewPost(item.dataset.id);
    });
    $('#btn-archive-back').addEventListener('click', goHome);
    $('#btn-bookmarks-back').addEventListener('click', goHome);

    // Post view actions
    $('#btn-back').addEventListener('click', goHome);
    $('#btn-edit').addEventListener('click', () => {
      if (!isAdmin()) return;
      const post = posts.find(p => p.id === dom.postView.dataset.postId);
      if (post) openEditor(post);
    });
    $('#btn-delete').addEventListener('click', () => { if (isAdmin()) deletePost(dom.postView.dataset.postId); });
    $('#btn-pin-post').addEventListener('click', () => { if (isAdmin()) togglePin(dom.postView.dataset.postId); });
    $('#btn-bookmark-post').addEventListener('click', () => { if (isAdmin()) toggleBookmark(dom.postView.dataset.postId); });


    // Share
    $('#btn-copy-link').addEventListener('click', () => copyPostLink(dom.postView.dataset.postId));
    $('#btn-share-twitter').addEventListener('click', () => {
      const post = posts.find(p => p.id === dom.postView.dataset.postId);
      if (post) shareTwitter(post);
    });
    $('#btn-share-linkedin').addEventListener('click', () => {
      const post = posts.find(p => p.id === dom.postView.dataset.postId);
      if (post) shareLinkedIn(post);
    });

    // Series nav delegation
    dom.postSeriesNav.addEventListener('click', (e) => {
      const link = e.target.closest('.series-link');
      if (link && !link.classList.contains('current')) viewPost(link.dataset.id);
    });

    // Reading progress
    window.addEventListener('scroll', updateReadingProgress);

    // Editor
    $('#btn-close-editor').addEventListener('click', closeEditor);
    $('#btn-cancel').addEventListener('click', closeEditor);
    $('#btn-publish').addEventListener('click', publishPost);
    $('#btn-fullscreen').addEventListener('click', () => {
      dom.editorContainer.classList.toggle('fullscreen');
      const icon = $('#btn-fullscreen i');
      icon.className = dom.editorContainer.classList.contains('fullscreen')
        ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    });
    $('#btn-cheatsheet').addEventListener('click', () => {
      dom.cheatsheetPanel.style.display = dom.cheatsheetPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Import from URL
    $('#btn-import-url').addEventListener('click', importFromUrl);

    // Pane expand/collapse
    $('#btn-expand-editor').addEventListener('click', () => togglePaneExpand('editor'));
    $('#btn-expand-preview').addEventListener('click', () => togglePaneExpand('preview'));

    dom.editorTextarea.addEventListener('input', () => {
      saveSnapshot();
      updatePreview();
      updateWordCount();
    });
    dom.editorTextarea.addEventListener('keydown', handleTabKey);

    // Toolbar buttons
    $$('.editor-toolbar button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (toolbarActions[action]) toolbarActions[action]();
      });
    });

    // Emoji picker delegation
    dom.emojiPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('.emoji-btn');
      if (!btn) return;
      insertAtCursor(btn.dataset.emoji);
      dom.emojiPicker.style.display = 'none';
    });

    // Cover image
    dom.inputCover.addEventListener('change', (e) => handleCoverImage(e.target.files[0]));
    dom.btnRemoveCover.addEventListener('click', resetCover);

    // Inline image
    dom.inputInlineImage.addEventListener('change', (e) => {
      handleInlineImage(e.target.files[0]);
      e.target.value = '';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleEditorShortcuts);

    // Confirm dialog
    $('#confirm-cancel').addEventListener('click', () => {
      dom.confirmDialog.style.display = 'none';
      confirmCallback = null;
    });
    $('#confirm-ok').addEventListener('click', () => {
      dom.confirmDialog.style.display = 'none';
      if (confirmCallback) confirmCallback();
      confirmCallback = null;
    });

    // Export / Import
    $('#btn-export').addEventListener('click', (e) => { e.preventDefault(); exportData(); });
    dom.inputImport.addEventListener('change', (e) => { importData(e.target.files[0]); e.target.value = ''; });

    // Close modals on overlay click
    dom.editorModal.addEventListener('click', (e) => { if (e.target === dom.editorModal) closeEditor(); });
    dom.confirmDialog.addEventListener('click', (e) => {
      if (e.target === dom.confirmDialog) { dom.confirmDialog.style.display = 'none'; confirmCallback = null; }
    });
    // Paste images in editor
    dom.editorTextarea.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          handleInlineImage(item.getAsFile());
          break;
        }
      }
    });

    // Drag & drop images
    dom.editorTextarea.addEventListener('dragover', (e) => e.preventDefault());
    dom.editorTextarea.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) handleInlineImage(file);
    });

    // Hash change for deep links
    window.addEventListener('hashchange', handleHash);
  }

  // ───── Pokémon Animated Background ─────
  function initBgCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let items = [];
    let sparkles = [];
    let stars = [];
    let nebulae = [];
    let shootingStars = [];
    let time = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGalaxy();
    }
    resize();
    window.addEventListener('resize', resize);

    function getAccent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#58a6ff';
    }

    // ── Galaxy: distant stars ──
    function initGalaxy() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.6 + 0.1,
          twinkleSpeed: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
          color: isDark
            ? ['#ffffff', '#ffe4c4', '#c4d4ff', '#ffd4e8', '#d4ffe4'][Math.floor(Math.random() * 5)]
            : ['#b0b0b0', '#c4a882', '#8899cc', '#cc99aa', '#88bb99'][Math.floor(Math.random() * 5)],
        });
      }
      nebulae = [];
      const nebulaColors = isDark
        ? ['rgba(88,166,255,', 'rgba(188,140,255,', 'rgba(247,120,186,', 'rgba(63,185,80,', 'rgba(255,136,62,']
        : ['rgba(100,149,237,', 'rgba(147,112,219,', 'rgba(255,182,193,', 'rgba(144,238,144,', 'rgba(255,218,185,'];
      for (let i = 0; i < 5; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rx: Math.random() * 250 + 150,
          ry: Math.random() * 150 + 100,
          rotation: Math.random() * Math.PI,
          color: nebulaColors[i % nebulaColors.length],
          alpha: 0.025,
          driftX: (Math.random() - 0.5) * 0.05,
          driftY: (Math.random() - 0.5) * 0.03,
        });
      }
    }

    function drawGalaxy() {
      // Nebula clouds (soft gradient blobs)
      nebulae.forEach(n => {
        n.x += n.driftX;
        n.y += n.driftY;
        if (n.x < -300) n.x = canvas.width + 300;
        if (n.x > canvas.width + 300) n.x = -300;
        if (n.y < -200) n.y = canvas.height + 200;
        if (n.y > canvas.height + 200) n.y = -200;

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
        grad.addColorStop(0, n.color + (n.alpha + 0.015 * Math.sin(time * 0.5)) + ')');
        grad.addColorStop(0.5, n.color + (n.alpha * 0.5) + ')');
        grad.addColorStop(1, n.color + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Distant twinkling stars
      stars.forEach(s => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * s.twinkleSpeed + s.phase);
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle cross glow on brighter stars
        if (s.r > 1.2) {
          ctx.globalAlpha = s.alpha * twinkle * 0.3;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3, s.y);
          ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3);
          ctx.lineTo(s.x, s.y + s.r * 3);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    }

    // Shooting stars
    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.random() * 4 + 3,
        vy: Math.random() * 2 + 1,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
        length: Math.random() * 40 + 30,
        color: ['#ffffff', '#ffe4c4', '#c4d4ff'][Math.floor(Math.random() * 3)],
      });
    }

    function drawShootingStars() {
      shootingStars.forEach(ss => {
        ctx.save();
        ctx.globalAlpha = ss.life * 0.7;
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.length * 0.3, ss.y - ss.vy * ss.length * 0.3);
        grad.addColorStop(0, ss.color);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * ss.length * 0.3, ss.y - ss.vy * ss.length * 0.3);
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = ss.color;
        ctx.fill();
        ctx.restore();

        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;
      });
      shootingStars = shootingStars.filter(ss => ss.life > 0);

      // Random chance to spawn
      if (Math.random() < 0.003) spawnShootingStar();
    }

    // Draw a Pokéball
    function drawPokeball(x, y, r, alpha, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Bottom half (white)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Top half (red)
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#ff4444';
      ctx.fill();

      // Center band
      ctx.beginPath();
      ctx.rect(-r, -r * 0.08, r * 2, r * 0.16);
      ctx.fillStyle = '#222';
      ctx.fill();

      // Center circle outer
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#222';
      ctx.fill();

      // Center circle inner
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Subtle glow
      const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.5);
      glow.addColorStop(0, 'rgba(255,255,255,0.05)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.restore();
    }

    // Draw a star/sparkle
    function drawStar(x, y, r, alpha, color) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      }
      ctx.arc(x, y, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw a Pikachu silhouette (simplified)
    function drawPikachu(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      const accent = getAccent();
      ctx.fillStyle = accent;

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0, -size * 0.55, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Left ear
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, -size * 0.85);
      ctx.lineTo(-size * 0.35, -size * 1.3);
      ctx.lineTo(-size * 0.02, -size * 0.9);
      ctx.fill();

      // Right ear
      ctx.beginPath();
      ctx.moveTo(size * 0.2, -size * 0.85);
      ctx.lineTo(size * 0.35, -size * 1.3);
      ctx.lineTo(size * 0.02, -size * 0.9);
      ctx.fill();

      ctx.restore();
    }

    // Draw Eevee silhouette
    function drawEevee(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      const accent = getAccent();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -size * 0.5, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.2, size * 0.5, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-size * 0.3, -size * 1.0, size * 0.12, size * 0.35, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.3, -size * 1.0, size * 0.12, size * 0.35, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.3, size * 0.3, size * 0.2, size * 0.45, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Bulbasaur silhouette
    function drawBulbasaur(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#4ecdc4';
      // Body (wide)
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(-size * 0.4, -size * 0.25, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      // Bulb on back
      ctx.fillStyle = '#2d8a6e';
      ctx.beginPath();
      ctx.ellipse(size * 0.05, -size * 0.45, size * 0.3, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      // Leaves
      ctx.fillStyle = '#45b87f';
      ctx.beginPath();
      ctx.ellipse(-size * 0.1, -size * 0.75, size * 0.12, size * 0.25, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.15, -size * 0.75, size * 0.12, size * 0.25, 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillStyle = '#4ecdc4';
      ctx.beginPath();
      ctx.ellipse(-size * 0.35, size * 0.35, size * 0.12, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.35, size * 0.35, size * 0.12, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Charmander silhouette
    function drawCharmander(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ff8c42';
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.35, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(0, -size * 0.55, size * 0.32, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(size * 0.15, size * 0.3);
      ctx.quadraticCurveTo(size * 0.6, size * 0.1, size * 0.5, -size * 0.2);
      ctx.lineWidth = size * 0.12;
      ctx.strokeStyle = '#ff8c42';
      ctx.stroke();
      // Tail flame
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(size * 0.5, -size * 0.28, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(size * 0.5, -size * 0.32, size * 0.07, 0, Math.PI * 2);
      ctx.fill();
      // Belly
      ctx.fillStyle = '#ffd89b';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.05, size * 0.2, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Squirtle silhouette
    function drawSquirtle(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#5bc0eb';
      // Shell
      ctx.beginPath();
      ctx.ellipse(0, size * 0.05, size * 0.45, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8b5e3c';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.08, size * 0.38, size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#5bc0eb';
      ctx.beginPath();
      ctx.arc(0, -size * 0.5, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(size * 0.2, size * 0.35);
      ctx.quadraticCurveTo(size * 0.55, size * 0.5, size * 0.4, size * 0.15);
      ctx.lineWidth = size * 0.1;
      ctx.strokeStyle = '#5bc0eb';
      ctx.stroke();
      // Belly
      ctx.fillStyle = '#f0e6c0';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.1, size * 0.22, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Gengar silhouette
    function drawGengar(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#7b5ea7';
      // Body (round)
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      // Left spike ear
      ctx.beginPath();
      ctx.moveTo(-size * 0.35, -size * 0.4);
      ctx.lineTo(-size * 0.55, -size * 0.95);
      ctx.lineTo(-size * 0.1, -size * 0.5);
      ctx.fill();
      // Right spike ear
      ctx.beginPath();
      ctx.moveTo(size * 0.35, -size * 0.4);
      ctx.lineTo(size * 0.55, -size * 0.95);
      ctx.lineTo(size * 0.1, -size * 0.5);
      ctx.fill();
      // Grin
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.1, size * 0.3, size * 0.12, 0, 0, Math.PI);
      ctx.fill();
      // Eyes (red glow)
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(-size * 0.18, -size * 0.12, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.18, -size * 0.12, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Snorlax silhouette
    function drawSnorlax(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#2d4059';
      // Big round body
      ctx.beginPath();
      ctx.ellipse(0, size * 0.1, size * 0.6, size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(0, -size * 0.5, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      // Belly
      ctx.fillStyle = '#f0e6c0';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.15, size * 0.4, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      // Closed eyes (sleeping!)
      ctx.strokeStyle = '#2d4059';
      ctx.lineWidth = size * 0.04;
      ctx.beginPath();
      ctx.arc(-size * 0.12, -size * 0.48, size * 0.06, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 0.12, -size * 0.48, size * 0.06, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    // Create floating items — more Pokémon, bigger, more visible
    const types = ['pokeball', 'pikachu', 'eevee', 'bulbasaur', 'charmander', 'squirtle', 'gengar', 'snorlax', 'pokeball', 'pikachu'];
    for (let i = 0; i < 20; i++) {
      items.push({
        type: types[i % types.length],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 18 + 14,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        alpha: Math.random() * 0.15 + 0.12,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create sparkles
    for (let i = 0; i < 45; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.8,
        alpha: 0,
        maxAlpha: Math.random() * 0.25 + 0.08,
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animationId = null;
    let isReading = false;

    // Static reading background — calm galaxy only
    function drawStaticBg() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Soft nebulae
      nebulae.forEach(n => {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
        grad.addColorStop(0, n.color + '0.03)');
        grad.addColorStop(0.5, n.color + '0.015)');
        grad.addColorStop(1, n.color + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      // Steady stars (no twinkling)
      stars.forEach(s => {
        ctx.globalAlpha = s.alpha * 0.5;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function pauseAnimation() {
      isReading = true;
      if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
      drawStaticBg();
    }

    function resumeAnimation() {
      isReading = false;
      if (!animationId) draw();
    }

    // Expose pause/resume
    window._bgPause = pauseAnimation;
    window._bgResume = resumeAnimation;
    window._bgReinit = () => { initGalaxy(); if (!isReading) { /* redraw will pick up new colors */ } else { drawStaticBg(); } };

    function draw() {
      if (isReading) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      const accent = getAccent();

      // Layer 1: Galaxy (nebulae + stars)
      drawGalaxy();

      // Layer 2: Shooting stars
      drawShootingStars();

      // Layer 3: Sparkles
      sparkles.forEach(s => {
        s.alpha = s.maxAlpha * (0.5 + 0.5 * Math.sin(time * 3 + s.phase));
        drawStar(s.x, s.y, s.r, s.alpha, accent);
      });

      // Layer 4: Floating Pokémon
      items.forEach(item => {
        const bobY = Math.sin(time * 1.5 + item.bobOffset) * 8;

        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.rotSpeed;

        if (item.x < -40) item.x = canvas.width + 40;
        if (item.x > canvas.width + 40) item.x = -40;
        if (item.y < -40) item.y = canvas.height + 40;
        if (item.y > canvas.height + 40) item.y = -40;

        const drawX = item.x;
        const drawY = item.y + bobY;

        if (item.type === 'pokeball') {
          drawPokeball(drawX, drawY, item.size, item.alpha, item.rotation);
        } else if (item.type === 'pikachu') {
          drawPikachu(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'eevee') {
          drawEevee(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'bulbasaur') {
          drawBulbasaur(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'charmander') {
          drawCharmander(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'squirtle') {
          drawSquirtle(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'gengar') {
          drawGengar(drawX, drawY, item.size, item.alpha);
        } else if (item.type === 'snorlax') {
          drawSnorlax(drawX, drawY, item.size, item.alpha);
        }
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }
    draw();
  }

  // ───── Init ─────
  function init() {
    initTheme();
    initAccent();
    loadPosts();
    loadBookmarks();
    loadViews();
    loadSubtitle();
    loadAuth();
    initEmojiPicker();
    initBgCanvas();
    bindEvents();
    updateAuthUI();
    render();
    handleHash();
  }

  init();
})();
