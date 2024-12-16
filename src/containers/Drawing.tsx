import React, { createRef, useEffect, useState } from 'react';
import { DragActions } from '../entities';
import { getMovePosition } from '../utils/helpers';
import { Drawing as DrawingComponent } from '../components/Drawing';

interface Props {
  pageWidth: number;
  pageHeight: number;
  removeDrawing: () => void;
  updateDrawingAttachment: (drawingObject: Partial<DrawingAttachment>) => void;
}

export const Drawing = ({
  x,
  y,
  width,
  height,
  stroke,
  strokeWidth,
  path,
  pageWidth,
  pageHeight,
  removeDrawing,
  updateDrawingAttachment,
}: DrawingAttachment & Props) => {
  const svgRef = createRef<SVGSVGElement>();
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const [operation, setOperation] = useState<DragActions>(DragActions.NO_MOVEMENT);
  const [dimmerActive, setDimmerActive] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<string[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  }, [svgRef, width, height]);

  const handleMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMouseDown(true);
    
    const directions = event.currentTarget.dataset.direction;
    if (directions) {
      setDirection(directions.split('-'));
      setOperation(DragActions.SCALE);
    } else {
      setOperation(DragActions.MOVE);
    }
    setStartPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (mouseDown) {
      if (operation === DragActions.MOVE) {
        const dx = event.clientX - startPos.x;
        const dy = event.clientY - startPos.y;

        const newLeft = Math.max(0, Math.min(positionLeft + dx, pageWidth - currentWidth));
        const newTop = Math.max(0, Math.min(positionTop + dy, pageHeight - currentHeight));

        setPositionLeft(newLeft);
        setPositionTop(newTop);
        setStartPos({ x: event.clientX, y: event.clientY });
      } else if (operation === DragActions.SCALE) {
        const minSize = 50;
        let newWidth = currentWidth;
        let newHeight = currentHeight;
        let newLeft = positionLeft;
        let newTop = positionTop;

        if (direction.includes('top') || direction.includes('left')) {
          if (direction.includes('left')) {
            newWidth = Math.max(minSize, currentWidth - event.movementX);
            newLeft = positionLeft + event.movementX;
          }
          if (direction.includes('top')) {
            newHeight = Math.max(minSize, currentHeight - event.movementY);
            newTop = positionTop + event.movementY;
          }
        } else {
          newWidth = Math.max(minSize, currentWidth + event.movementX);
          newHeight = Math.max(minSize, currentHeight + event.movementY);
        }

        if (newWidth >= minSize && newWidth <= pageWidth) {
          setCurrentWidth(newWidth);
          setPositionLeft(newLeft);
        }
        if (newHeight >= minSize && newHeight <= pageHeight) {
          setCurrentHeight(newHeight);
          setPositionTop(newTop);
        }
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMouseDown(false);

    if (operation === DragActions.MOVE || operation === DragActions.SCALE) {
      updateDrawingAttachment({
        x: positionLeft,
        y: positionTop,
        width: currentWidth,
        height: currentHeight,
      });
    }

    setOperation(DragActions.NO_MOVEMENT);
  };

  const handleResize = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const scale = event.deltaY > 0 ? 0.9 : 1.1;
    
    const newWidth = currentWidth * scale;
    const newHeight = currentHeight * scale;
    
    // Giới hạn kích thước tối thiểu và tối đa
    if (newWidth < 20 || newWidth > pageWidth || 
        newHeight < 20 || newHeight > pageHeight) {
      return;
    }

    setCurrentWidth(newWidth);
    setCurrentHeight(newHeight);
    
    updateDrawingAttachment({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (operation === DragActions.MOVE) {
      handleMouseUp(event);
    }
  };

  const handleClick = () => setDimmerActive(true);
  const cancelDelete = () => setDimmerActive(false);
  const confirmDelete = () => {
    cancelDelete();
    removeDrawing();
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
      updateDrawingAttachment({
        x: positionLeft,
        y: positionTop,
      });
    }
    setOperation(DragActions.NO_MOVEMENT);
  };

  return (
    <DrawingComponent
      stroke={stroke}
      strokeWidth={strokeWidth}
      path={path}
      width={currentWidth}
      svgRef={svgRef}
      height={currentHeight}
      onClick={handleClick}
      cancelDelete={cancelDelete}
      dimmerActive={dimmerActive}
      deleteDrawing={confirmDelete}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
      handleMouseOut={handleMouseOut}
      handleMouseUp={handleMouseUp}
      positionLeft={positionLeft}
      positionTop={positionTop}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
    />
  );
};
