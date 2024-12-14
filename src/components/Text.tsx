import React, { RefObject } from "react"

import { TextMode } from "../entities"

interface Props {
  inputRef: RefObject<HTMLInputElement>
  text?: string
  mode: string
  width: number
  size?: number
  height: number
  lineHeight?: number
  fontFamily?: string
  positionTop: number
  positionLeft: number
  toggleEditMode: () => void
  handleMouseDown: DragEventListener<HTMLDivElement>
  handleMouseUp: DragEventListener<HTMLDivElement>
  handleMouseMove: DragEventListener<HTMLDivElement>
  handleMouseOut: DragEventListener<HTMLDivElement>
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeText: () => void
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void
}

export const Text: React.FC<Props> = ({
  text,
  width,
  height,
  inputRef,
  mode,
  size,
  fontFamily,
  positionTop,
  positionLeft,
  onChangeText,
  toggleEditMode,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
  removeText,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) => {
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onDoubleClick={toggleEditMode}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "absolute",
        width,
        height,
        fontFamily,
        fontSize: size,
        lineHeight,
        cursor: mode === TextMode.COMMAND ? "move" : "default",
        top: positionTop,
        left: positionLeft,
        borderColor: "gray",
        borderStyle: "solid",
        wordWrap: "break-word",
        padding: 0,
        touchAction: "none",
        zIndex: 1000,
        WebkitUserSelect: "none",
        userSelect: "none"
      }}
    >
      <button
        onClick={removeText}
        style={{
          position: "absolute",
          right: -10,
          top: -10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid gray",
          backgroundColor: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        x
      </button>
      <input
        type="text"
        ref={inputRef}
        onChange={onChangeText}
        readOnly={mode === TextMode.COMMAND}
        style={{
          width: "100%",
          borderStyle: "none",
          borderWidth: 0,
          fontFamily,
          fontSize: size,
          outline: "none",
          padding: 0,
          boxSizing: "border-box",
          lineHeight,
          height,
          margin: 0,
          backgroundColor: "transparent",
          cursor: mode === TextMode.COMMAND ? "move" : "text",
          userSelect: "none",
        }}
        value={text}
      />
    </div>
  )
}
