/**
 * "YYYY-MM" 형태의 기간 문자열을 "n월" 표시 라벨로 변환한다.
 * formatDate와 마찬가지로 순수 표시 형식 변환만 담당하며, 값 계산/집계는 하지 않는다.
 */
export function formatMonthLabel(period: string): string {
  const [, month] = period.split("-");
  const monthNumber = Number(month);

  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return period;
  }

  return `${monthNumber}월`;
}
