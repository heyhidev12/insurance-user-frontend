import React from 'react';
import Icon from '../Icon';
// styles는 _app.tsx에서 import됨

export interface StepItem {
  /** 스텝 번호 (STEP 01, STEP 02 등) */
  number: string;
  /** 스텝 라벨 */
  label: string;
}

export interface StepIndicatorProps {
  /** 스텝 목록 */
  steps: StepItem[];
  /** 현재 스텝 (1부터 시작) */
  currentStep: number;
  /** 클래스명 */
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`step-indicator ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div
              className={`step-indicator__item ${isActive ? 'step-indicator__item--active' : ''} ${isCompleted ? 'step-indicator__item--completed' : ''}`}
            >
              <div className="step-indicator__circle">
                <Icon
                  type={
                    isActive 
                      ? 'check-blue' 
                      : 'check-gray-light' // 완료된 스텝과 비활성화된 스텝 모두 회색 체크
                  }
                  size={20}
                  className="step-indicator__check"
                />
              </div>
              <span className="step-indicator__number">{step.number}</span>
              <span className="step-indicator__label">{step.label}</span>
            </div>
            {!isLast && <div className="step-indicator__divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
