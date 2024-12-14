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

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  }, [svgRef, width, height]);

  const handleMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(true);
    setOperation(DragActions.MOVE);
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
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMouseDown(false);

    if (operation === DragActions.MOVE) {
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
    />
  );
};
