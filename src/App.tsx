import KakaoMap from './components/KakaoMap';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>서울특별시 구별 지도</h1>
        <p>구를 클릭하면 상세 정보를 확인할 수 있습니다</p>
      </header>
      <main className="app-main">
        <KakaoMap />
      </main>
    </div>
  );
}
