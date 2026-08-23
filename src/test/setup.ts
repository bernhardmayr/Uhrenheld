import '@testing-library/jest-dom/vitest';

// jsdom has no PointerEvent constructor, so RTL's fireEvent.pointer* falls back
// to a plain Event that silently drops clientX/clientY/pointerId. Real browsers
// do support PointerEvent (that's what SettableClock's dragging relies on) –
// this polyfill just lets component tests simulate it.
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    public pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
    }
  }
  // @ts-expect-error - minimal polyfill, not a spec-complete PointerEvent
  window.PointerEvent = PointerEventPolyfill;
}
if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}
