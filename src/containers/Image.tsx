import React, { useState, useEffect, useRef } from 'react';
import { DragActions } from '../entities';
import { getMovePosition } from '../utils/helpers';
import { Image as ImageComponent } from '../components/Image';

const IMAGE_MAX_SIZE = 300;

interface Props {
  pageWidth: number;
  pageHeight: number;
  removeImage: () => void;
  updateImageAttachment: (imageObject: Partial<ImageAttachment>) => void;
}

export const Image = ({
  x,
  y,
  img,
  width,
  height,
  pageWidth,
  removeImage,
  pageHeight,
  updateImageAttachment,
}: ImageAttachment & Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [direction, setDirection] = useState<string[]>([]);
  const [operation, setOperation] = useState<DragActions>(
    DragActions.NO_MOVEMENT
  );

  const [dimmerActive, setDimmerActive] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMouseDown(true);
    setOperation(DragActions.MOVE);
    const directions = event.currentTarget.dataset.direction;
    if (directions) {
      setDirection(directions.split('-'));
      setOperation(DragActions.SCALE);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (mouseDown) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        canvasWidth,
        canvasHeight,
        pageWidth,
        pageHeight
      );

      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMouseDown(false);

    if (operation === DragActions.MOVE) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        canvasWidth,
        canvasHeight,
        pageWidth,
        pageHeight
      );

      updateImageAttachment({
        x: left,
        y: top,
      });
    }

    if (operation === DragActions.SCALE) {
      updateImageAttachment({
        x: positionLeft,
        y: positionTop,
      });
    }

    setOperation(DragActions.NO_MOVEMENT);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (operation === DragActions.MOVE) {
      handleMouseUp(event);
    }
  };

  const handleImageScale = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (mouseDown) {
      const minSize = 50;
      
      if (direction.includes('left')) {
        const newWidth = Math.max(minSize, canvasWidth - event.movementX);
        if (newWidth >= minSize) {
          setPositionLeft(positionLeft + event.movementX);
          setCanvasWidth(newWidth);
        }
      }

      if (direction.includes('top')) {
        const newHeight = Math.max(minSize, canvasHeight - event.movementY);
        if (newHeight >= minSize) {
          setPositionTop(positionTop + event.movementY);
          setCanvasHeight(newHeight);
        }
      }

      if (direction.includes('right')) {
        const newWidth = Math.max(minSize, canvasWidth + event.movementX);
        setCanvasWidth(newWidth);
      }

      if (direction.includes('bottom')) {
        const newHeight = Math.max(minSize, canvasHeight + event.movementY);
        setCanvasHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    const renderImage = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      let scale = 1;
      if (canvasWidth > IMAGE_MAX_SIZE) {
        scale = IMAGE_MAX_SIZE / canvasWidth;
      }

      if (canvasHeight > IMAGE_MAX_SIZE) {
        scale = Math.min(scale, IMAGE_MAX_SIZE / canvasHeight);
      }

      const newCanvasWidth = canvasWidth * scale;
      const newCanvasHeight = canvasHeight * scale;

      setCanvasWidth(newCanvasWidth);
      setCanvasHeight(newCanvasHeight);

      canvas.width = newCanvasWidth;
      canvas.height = newCanvasHeight;

      context.drawImage(img, 0, 0, newCanvasWidth, newCanvasHeight);
      canvas.toBlob((blob) => {
        updateImageAttachment({
          file: blob as File,
          width: newCanvasWidth,
          height: newCanvasHeight,
        });
      });
    };

    renderImage(img);
  }, [img, canvasWidth, canvasHeight, updateImageAttachment]);

  const handleClick = () => setDimmerActive(true);
  const onCancelDelete = () => setDimmerActive(false);

  const deleteImage = () => {
    onCancelDelete();
    removeImage();
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const touch = event.touches[0];
    setMouseDown(true);
    setOperation(DragActions.MOVE);
    setLastTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!mouseDown) return;
    event.preventDefault();
    event.stopPropagation();
    const touch = event.touches[0];
    const movementX = touch.clientX - lastTouch.x;
    const movementY = touch.clientY - lastTouch.y;

    const { top, left } = getMovePosition(
      positionLeft,
      positionTop,
      movementX,
      movementY,
      width,
      height,
      pageWidth,
      pageHeight
    );

    setPositionTop(top);
    setPositionLeft(left);
    setLastTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMouseDown(false);
    if (operation === DragActions.MOVE) {
      updateImageAttachment({
        x: positionLeft,
        y: positionTop,
      });
    }
    setOperation(DragActions.NO_MOVEMENT);
  };

  return (
    <ImageComponent
      onClick={handleClick}
      dimmerActive={dimmerActive}
      cancelDelete={onCancelDelete}
      deleteImage={deleteImage}
      positionLeft={positionLeft}
      positionTop={positionTop}
      canvasRef={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      handleImageScale={handleImageScale}
      handleMouseDown={handleMouseDown}
      handleMouseUp={handleMouseUp}
      handleMouseMove={handleMouseMove}
      handleMouseOut={handleMouseOut}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
    />
  );
};
