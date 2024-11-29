import React from "react"
import { Button, Dropdown, Icon, Menu } from "semantic-ui-react"

interface MenuBarProps {
  openHelp: () => void
  saveToServer: () => void
  downloadPdf: () => void
  addText: () => void
  addImage: () => void
  addDrawing: () => void
  savingPdfStatus: boolean
  uploadNewPdf: () => void
  isPdfLoaded: boolean
}

export const MenuBar: React.FC<MenuBarProps> = ({
  openHelp,
  saveToServer,
  downloadPdf,
  addText,
  addImage,
  addDrawing,
  savingPdfStatus,
  uploadNewPdf,
  isPdfLoaded,
}) => (
  <Menu pointing>
    <Menu.Item header>PDF Editor</Menu.Item>
    <Menu.Menu position="right">
      {isPdfLoaded && (
        <>
          <Dropdown
            data-testid="edit-menu-dropdown"
            item
            closeOnBlur
            icon="edit outline"
            simple
          >
            <Dropdown.Menu>
              <Dropdown.Item onClick={addText}>Add Text</Dropdown.Item>
              <Dropdown.Item onClick={addImage}>Add Image</Dropdown.Item>
              <Dropdown.Item onClick={addDrawing}>Add Drawing</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button onClick={saveToServer} disabled={savingPdfStatus}>
            Save to Server
          </Button>

          <Button onClick={downloadPdf} disabled={savingPdfStatus}>
            Download PDF
          </Button>
          <Menu.Item
            data-testid="upload-menu-item"
            name="Upload New"
            onClick={uploadNewPdf}
          />
        </>
      )}
      <Menu.Item data-testid="help-menu-item" onClick={openHelp}>
        <Icon name="question circle outline" />
      </Menu.Item>
    </Menu.Menu>
  </Menu>
)
