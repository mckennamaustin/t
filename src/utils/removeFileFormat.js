export function removeFileFormat(file) {
  const period = file.lastIndexOf('.');
  return file.slice(0, period);
}
