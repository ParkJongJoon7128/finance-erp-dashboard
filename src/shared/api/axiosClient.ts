import axios from "axios";

/**
 * 모든 API 호출은 이 공용 axios 인스턴스를 통해서만 한다.
 * base URL, 공통 헤더, 에러 인터셉터를 한 곳에서 관리한다.
 * 현재 페이지는 FE-only mock 데이터를 사용하므로 실제 사용처는 없지만,
 * 향후 Route Handler 연동 시 바로 재사용할 수 있도록 구조만 마련해 둔다.
 */
export const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 공통 에러 응답 { error: { code, message } } 셰이프에 맞춘 처리를 여기에 추가한다.
    return Promise.reject(error);
  }
);
