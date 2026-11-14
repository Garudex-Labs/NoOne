import { defineLocale, type TranslationOverrides } from './define-locale'

export const koOverrides = {
  common: {
    apply: '적용', back: '뒤로', save: '저장', saving: '저장 중…', cancel: '취소', change: '변경',
    choose: '선택', clear: '지우기', close: '닫기', collapse: '접기', confirm: '확인', connect: '연결',
    connecting: '연결 중', continue: '계속', bots: '봇', copied: '복사됨', copy: '복사',
    copyFailed: '복사 실패', delete: '삭제', docs: '문서', done: '완료', error: '오류', expand: '펼치기',
    failed: '실패', formatJson: 'JSON 형식 정리', free: '무료', loading: '불러오는 중…', notSet: '설정되지 않음',
    refresh: '새로고침', remove: '제거', replace: '교체', retry: '다시 시도', run: '실행', send: '보내기',
    set: '설정', skip: '건너뛰기', update: '업데이트', tryHint: term => `“${term}”을 시도해 보세요`, on: '켜짐', off: '꺼짐'
  }
} satisfies TranslationOverrides

export const ko = defineLocale(koOverrides)
