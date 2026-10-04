export const metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '반도체 백과사전에서 다른 개념을 찾아보세요.',
};

export default function NotFound() {
  return (
    <main id="main">
      <section className="container empty-state">
        <span className="eyebrow">404</span>
        <h1>이 페이지를 찾지 못했어요.</h1>
        <p>백과사전에서 궁금한 개념을 다시 찾아보세요.</p>
        <a className="button navy" href="/encyclopedia/">백과사전으로 이동</a>
      </section>
    </main>
  );
}
