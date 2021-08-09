export function removeDangerAlertAPI(id: string, timeout: number) {
  return new Promise<{ id: string }>((resolve) =>
    setTimeout(() => resolve({ id: id }), timeout)
  );
}
