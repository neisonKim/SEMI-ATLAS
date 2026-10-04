export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <a className="brand" href="/">
            <img src="/favicon.svg" alt="" width="36" height="36" />
            <span>
              <b>반도체 백과사전</b>
              <small>작은 개념을 연결해, 큰 그림을 이해합니다.</small>
            </span>
          </a>
        </div>
        <nav aria-label="푸터 메뉴">
          <a href="/learn/">학습 경로</a>
          <a href="/encyclopedia/">전체 개념</a>
          <a href="/process/">공정 지도</a>
          <a href="/industry/">산업 지도</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>SEMICONDUCTOR ENCYCLOPEDIA</span>
        <p>학습용 AI 생성 이미지가 포함되어 있으며, 실제 제품·장비의 구조와 다를 수 있습니다.</p>
        <a href="#top">맨 위로</a>
      </div>
    </footer>
  );
}
