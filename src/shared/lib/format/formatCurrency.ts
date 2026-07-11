interface FormatCurrencyParams {
  amountMinor: number;
  currency: string;
}

/**
 * amountMinor는 서버가 이미 계산을 마친 최소 단위 정수값이다(예: KRW는 소수 단위가 없어
 * 최소 단위 = 원화 그대로, USD라면 센트 단위). 이 함수는 통화별 소수 자릿수에 맞춰
 * 최소 단위 값을 표시 단위로 환산하고 기호/천 단위 콤마를 적용하는 "표시 형식 변환"만 담당하며,
 * 합산/비율 계산 등 금액 재계산은 하지 않는다.
 */
export function formatCurrency({ amountMinor, currency }: FormatCurrencyParams): string {
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
  });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
  const amountMajor = amountMinor / 10 ** fractionDigits;

  return formatter.format(amountMajor);
}
