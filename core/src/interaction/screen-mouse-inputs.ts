import MouseInputs from "@remvst/client-inputs/lib/mouse/mouse-inputs";
import { between } from "../util/math";

export class ScreenMouseInputs extends MouseInputs {
    constructor(private readonly size: { width: number; height: number }) {
        super();
    }

    setMousePosition(
        x: number,
        y: number,
        movementX: number,
        movementY: number,
    ): void {
        if (document.pointerLockElement) {
            super.setMousePosition(
                between(0, this.position.x + movementX, this.size.width),
                between(0, this.position.y + movementY, this.size.height),
                movementX,
                movementY,
            );
        } else {
            super.setMousePosition(x, y, movementX, movementY);
        }
    }
}
