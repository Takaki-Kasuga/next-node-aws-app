export function removeAlertAPI(id: string, timeout: number) {
  return new Promise<{ id: string }>((resolve) =>
    setTimeout(() => resolve({ id: id }), timeout)
  );
}
