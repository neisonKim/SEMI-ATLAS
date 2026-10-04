'use client';

import { useEffect, useRef, useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
};

export default function ContactForm({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState('idle');
  const [notice, setNotice] = useState('');
  const dialogRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => nameRef.current?.focus(), 50);

    const onKey = (event) => {
      if (event.key === 'Escape' && state !== 'sending') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, state]);

  if (!open) return null;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (state === 'error') {
      setState('idle');
      setNotice('');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    setNotice('');

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || '문의 전송에 실패했습니다.');
      }

      setState('success');
      setNotice('문의가 전송되었습니다. 확인 후 회신드리겠습니다.');
      setForm(initialForm);
    } catch (error) {
      setState('error');
      setNotice(error.message || '문의 전송에 실패했습니다.');
    }
  };

  return (
    <div
      className="contact-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && state !== 'sending') onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="contact-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
      >
        <div className="contact-dialog-head">
          <div>
            <span className="eyebrow">CONTACT SEMI-ATLAS</span>
            <h2 id="contact-dialog-title">문의하기</h2>
            <p>작성한 내용은 <strong>studiokei805@gmail.com</strong>으로 전송됩니다.</p>
          </div>
          <button
            className="contact-dialog-close"
            type="button"
            aria-label="문의창 닫기"
            onClick={onClose}
            disabled={state === 'sending'}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {state === 'success' ? (
          <div className="contact-success" role="status">
            <span aria-hidden="true">✓</span>
            <strong>문의가 전송되었습니다.</strong>
            <p>남겨주신 이메일 주소로 회신할 수 있습니다.</p>
            <button className="button mint" type="button" onClick={onClose}>확인</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-form-grid">
              <label>
                <span>이름</span>
                <input
                  ref={nameRef}
                  name="name"
                  value={form.name}
                  onChange={update}
                  autoComplete="name"
                  maxLength="60"
                  required
                  placeholder="이름을 입력하세요"
                />
              </label>
              <label>
                <span>회신 이메일</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  autoComplete="email"
                  maxLength="160"
                  required
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <label>
              <span>문의 제목</span>
              <input
                name="subject"
                value={form.subject}
                onChange={update}
                maxLength="120"
                placeholder="문의 제목을 입력하세요"
              />
            </label>

            <label>
              <span>문의 내용</span>
              <textarea
                name="message"
                value={form.message}
                onChange={update}
                minLength="10"
                maxLength="4000"
                required
                rows="7"
                placeholder="문의 내용을 10자 이상 작성해주세요."
              />
            </label>

            <label className="contact-honeypot" aria-hidden="true">
              <span>웹사이트</span>
              <input name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" />
            </label>

            {notice && <p className={`contact-notice ${state}`} role="alert">{notice}</p>}

            <div className="contact-form-actions">
              <a
                className="contact-mail-fallback"
                href="mailto:studiokei805@gmail.com?subject=SEMI-ATLAS%20%EB%AC%B8%EC%9D%98"
              >
                메일 앱으로 보내기
              </a>
              <button className="button mint" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? '전송 중…' : '문의 보내기'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
