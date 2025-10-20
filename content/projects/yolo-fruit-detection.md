---
title: "Recognition and Separation of Fresh and Rotten Fruits using YOLO Algorithm"
date: 2023-08-10
tags: ["YOLO", "Deep Learning", "Computer Vision", "Python", "Agrotechnology"]
cover:
  alt: "YOLO Fruit Detection"
  caption: "Detection of fresh and rotten fruits using YOLOv5"
draft: false
image: "/images/fruits.png"
---

## Overview
Developed a computer vision system that detects and classifies fruits as fresh or rotten using state-of-the-art deep learning algorithms, including YOLOv7-tiny, R-CNN, DETR, YOLOv8, and YOLOv12S.

The system is designed for real-time operation on a conveyor belt, integrating:

- Raspberry Pi for edge computing  
- Two webcams for multiple viewing angles  
- Servo motors to automatically separate rotten fruits from fresh ones  

This setup enables automated quality control in fruit processing lines, improving efficiency and reducing human error.  

The scientific and technological principles applied in **agrotechnology** improve the effectiveness, productivity, and sustainability of the agricultural system. Four high-performance object detection models—YOLOv8, YOLOv12S, DETR, and Faster R-CNN—were compared using key performance metrics including **mean Average Precision (mAP)** and **F1-Score** to classify rotten and fresh tomatoes and apples.  

**YOLOv12S** stands out among the four models on a custom dataset of size 11,675, achieving **mAP of 99.31%** and **F1-Score of 98.28%**. Its CNN backbone enables fast inference, making it well-suited for real-time applications, while DETR’s transformer-based global context modeling offers strong accuracy for complex scenes.  

Unlike past efforts focusing on single models, this comparison spans multiple architectures, revealing their strengths, weaknesses, and practical roles in farming.  

Fruit quality evaluation is crucial in today's food processing and distribution systems to assure consumer safety and minimize food waste. Fruits are often sorted manually, which is time-consuming, labor-intensive, and error-prone. This project leverages **computer vision and deep learning** to automate fruit quality evaluation, providing a **real-time, efficient, and accurate system**.  

For the project, images of **Apple** and **Tomato** were collected and annotated in different orientations and shades. The dataset was divided into four classes for training the YOLO models.  

This work presents a novel approach for the automated **recognition and separation of fresh and rotten fruits** on conveyor belts using YOLO algorithms and Raspberry Pi. The system bridges the gap between **AI and agriculture**, showcasing the potential of technology to revolutionize food quality inspection.  

---

## Objectives
- Build a real-time detection system for fruit classification  
- Train YOLOv7-tiny, R-CNN, YOLOv8, YOLOv12S on a custom fruit dataset  
- Automatically separate fresh and rotten fruits  

---

## Technologies Used
- YOLOv7-tiny  
- R-CNN  
- YOLOv8  
- YOLOv12S  
- Python  
- OpenCV  
- PyTorch  

---

## Results
Achieved high accuracy and real-time processing speed.  

### Sample Outputs
![YOLO Detection Sample](/images/y1.jpg)
![YOLO Detection Sample](/images/c1.jpg)
![YOLO Detection Sample](/images/y5.jpeg)
![YOLO Detection Sample](/images/y4.jpeg)
![YOLO Detection Sample](/images/y8.jpeg)

---

## External Links
- 🔗 [ResearchGate Paper 1](https://www.researchgate.net/publication/392031828_Comparative_Study_of_Object_Detection_Models_for_Fresh_and_Rotten_Apples_and_Tomatoes_Faster_R-CNN_DETR_YOLOv8_and_YOLOv12S)  
- 🔗 [ResearchGate Paper 2](https://www.researchgate.net/publication/379986263_Recognition_and_separation_of_fresh_and_rotten_fruits_using_YOLO_algorithm)  
- 💻 [GitHub Repository](https://github.com/PrmBRana/Rotten_And_Fresh_Fruits_Detection_And_Separation)  
