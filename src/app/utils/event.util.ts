export function createEvent(name: string, data: any) {
  const event = new CustomEvent(name, {
    detail: JSON.stringify(data)
  });
  window.document.dispatchEvent(event);
}
