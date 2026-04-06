
// import MainLayout from "./layout/MainLayout";

// function App() {
//   return (
//     <MainLayout>
//       <h1>Dashboard</h1>
//     </MainLayout>
//   );
// }

// export default App;
import AppRouter from "./router/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
// V.3
// import LandingPage from "./pages/LandingPage";

// function App() {
//   return <LandingPage />;
// }

// export default App;

// V.1
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// V.2
// import { Layout, Typography } from "antd";

// const { Header, Content } = Layout;
// const { Title } = Typography;

// function App() {
//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Header style={{ background: "#001529" }}>
//         <Title style={{ color: "white", margin: 0 }} level={3}>
//           File Management System
//         </Title>
//       </Header>

//       <Content style={{ padding: "24px" }}>
//         <h2>ระบบจัดการแฟ้มงาน</h2>
//       </Content>
//     </Layout>
//   );
// }

// export default App;