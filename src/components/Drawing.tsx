import React, { RefObject } from "react"
import { Dimmer } from "semantic-ui-react"

import { Div } from "../ui/components/Div"
import { ConfirmContent } from "./ConfirmContent"

interface Props {
  path?: string
  stroke?: string
  width: number
  height: number
  strokeWidth?: number
  positionTop: number
  positionLeft: number
  dimmerActive: boolean
  cancelDelete: () => void
  deleteDrawing: () => void
  onClick: () => void
  svgRef: RefObject<SVGSVGElement>
  handleMouseDown: DragEventListener<HTMLDivElement>
  handleMouseUp: DragEventListener<HTMLDivElement>
  handleMouseMove: DragEventListener<HTMLDivElement>
  handleMouseOut: DragEventListener<HTMLDivElement>
  scale?: number
}
export const Drawing: React.FC<Props> = ({
  dimmerActive,
  cancelDelete,
  deleteDrawing,
  positionTop,
  positionLeft,
  width,
  height,
  svgRef,
  path,
  stroke,
  strokeWidth,
  scale = 0.15,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  onClick,
}) => {
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      style={{
        position: "absolute",
        top: positionTop,
        left: positionLeft,
        width,
        height,
        cursor: "move",
      }}
    >
      <Dimmer.Dimmable as={Div} dimmed={dimmerActive}>
        <div style={{ position: "relative" }}>
          <button
            onClick={deleteDrawing}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 20,
              height: 20,
              padding: 0,
              borderRadius: "50%",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              zIndex: 1000,
              userSelect: "none",
            }}
          >
            ×
          </button>
          <svg 
            ref={svgRef}
            width={width}
            height={height}
            viewBox={`0 0 ${width/scale} ${height/scale}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible'
            }}
          >
            <path
              strokeWidth={strokeWidth || 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke={stroke || "#000"}
              fill="none"
              d={path}
              transform={`scale(${scale})`}
            />
          </svg>
        </div>
      </Dimmer.Dimmable>
    </div>
  )
}
