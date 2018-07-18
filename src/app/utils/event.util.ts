export function createEvent(name: string, data: any) {
  const event = new CustomEvent(name, {
    detail: data
  });
  window.document.dispatchEvent(event);
}
