/**
 * ISO 8601 UTC 문자열을 로컬 표시 문자열(예: "2026.07.10")로 변환한다.
 * 서버는 항상 UTC로 직렬화하고, 로컬 타임존 표시 변환은 FE에서 담당한다.
 */
export function formatDate(isoUtc: string): string {
  const date = new Date(isoUtc);

  if (Number.isNaN(date.getTime())) {
    return isoUtc;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}
