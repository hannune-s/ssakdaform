export const getSmartPlaceholder = (label: string): string => {
  if (!label) return "내용을 입력해주세요";
  if (label.includes('이름') || label.includes('성함') || label.includes('고객명') || label.includes('입금자')) return "예: 홍길동";
  if (label.includes('연락처') || label.includes('전화번호') || label.includes('휴대폰')) return "예: 010-0000-0000";
  if (label.includes('날짜') || label.includes('일정')) return "예: 2024-12-25";
  if (label.includes('시간')) return "예: 오후 2시 30분";
  if (label.includes('주소')) return "클릭하여 주소 검색";
  if (label.includes('메모') || label.includes('요청') || label.includes('기타') || label.includes('내용') || label.includes('사항')) return "자유롭게 남겨주세요";
  if (label.includes('인원') || label.includes('명')) return "예: 성인 2명";
  if (label.includes('상품')) return "예: 아이스 아메리카노 2잔";
  return `예: ${label}을(를) 입력해주세요`;
};
