import React, { useState, useEffect, useMemo } from 'react';
import styles from './DatePickerModal.module.scss';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedDate: string) => void;
  availableDates: string[]; // 교육 가능한 날짜들
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  availableDates,
}) => {
  // 날짜 문자열을 정규화 (YYYY.MM.DD 형식으로 통일)
  const normalizeDateString = (dateStr: string): string => {
    // YYYY-MM-DD 또는 YYYY.MM.DD 형식을 YYYY.MM.DD로 변환
    const normalized = dateStr.replace(/-/g, '.');
    const parts = normalized.split('.');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}.${month}.${day}`;
    }
    return dateStr;
  };

  // 정규화된 availableDates 배열 생성
  const normalizedAvailableDates = useMemo(() => {
    if (!availableDates || availableDates.length === 0) return [];
    return availableDates.map(normalizeDateString);
  }, [availableDates]);

  // 처음 가능한 날짜를 기준으로 초기 월 설정
  const getInitialMonth = () => {
    if (normalizedAvailableDates && normalizedAvailableDates.length > 0) {
      const firstAvailableDate = normalizedAvailableDates[0];
      const dateParts = firstAvailableDate.split('.');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // 월은 0부터 시작
        return new Date(year, month, 1);
      }
    }
    return new Date();
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 모달이 열릴 때마다 처음 가능한 날짜를 기준으로 월 설정
  useEffect(() => {
    if (isOpen) {
      const initialMonth = getInitialMonth();
      setCurrentMonth(initialMonth);
    }
  }, [isOpen, normalizedAvailableDates]);

  if (!isOpen) return null;

  // 현재 월의 첫 날과 마지막 날
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // 날짜가 교육 가능한 날짜인지 확인
  const isAvailableDate = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return normalizedAvailableDates.includes(dateStr);
  };

  // 날짜 선택
  const selectDate = (date: Date) => {
    if (!isAvailableDate(date)) return;
    
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
  };

  // 날짜가 선택되었는지 확인
  const isSelected = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return selectedDate === dateStr;
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      onClose();
    }
  };

  // 달력 그리드 생성
  const calendarDays: (Date | null)[] = [];
  
  // 이전 달의 마지막 날들 (빈 칸)
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 현재 달의 날들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthYear = `${year}.${String(month + 1).padStart(2, '0')}`;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerSpacer} />
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.calendar}>
            <div className={styles.monthHeader}>
              <button className={styles.monthNav} onClick={goToPreviousMonth}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 5L7.5 10L12.5 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h3 className={styles.monthYear}>{monthYear}</h3>
              <button className={styles.monthNav} onClick={goToNextMonth}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 5L12.5 10L7.5 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.weekDays}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rowIndex) => {
                const rowDays = calendarDays.slice(rowIndex * 7, (rowIndex + 1) * 7);
                // 마지막 줄이 7개가 안 되면 빈 셀로 채우기
                const paddedRowDays = [...rowDays];
                while (paddedRowDays.length < 7) {
                  paddedRowDays.push(null);
                }
                
                return (
                  <div key={rowIndex} className={styles.calendarRow}>
                    {paddedRowDays.map((date, cellIndex) => {
                      const index = rowIndex * 7 + cellIndex;
                      if (!date) {
                        return <div key={`empty-${index}`} className={styles.calendarCellEmpty} />;
                      }

                      const available = isAvailableDate(date);
                      const selected = isSelected(date);

                      return (
                        <button
                          key={formatDate(date)}
                          className={`${styles.calendarCell} ${available ? styles.available : styles.unavailable} ${selected ? styles.selected : ''}`}
                          onClick={() => available && selectDate(date)}
                          disabled={!available}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </>
  );
};

export default DatePickerModal;

