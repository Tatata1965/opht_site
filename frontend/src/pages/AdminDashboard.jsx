// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
// Импорты для графиков
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState([]);
    const [workloadData, setWorkloadData] = useState([]);
    const [chartsLoading, setChartsLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setChartsLoading(true);

            try {
                await Promise.all([
                    fetchDashboardData(),
                    fetchChartsData()
                ]);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    const fetchChartsData = async () => {
        try {
            // Загружаем данные для тренда записей
            const trendResponse = await fetch('http://localhost:8000/api/analytics/appointments-trend/');
            const trendData = await trendResponse.json();
            setTrendData(trendData);

            // Загружаем данные для загрузки врачей
            const workloadResponse = await fetch('http://localhost:8000/api/analytics/doctor-workload/');
            const workloadData = await workloadResponse.json();
            setWorkloadData(workloadData);

        } catch (error) {
            console.error('Ошибка загрузки графиков:', error);
        } finally {
            setChartsLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/analytics/dashboard/');
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка статистики...</p>
        </div>
    );

    if (!stats) return (
        <div className="error-container">
            <h2>❌ Ошибка загрузки данных</h2>
            <button onClick={fetchDashboardData}>Повторить попытку</button>
        </div>
    );

    // Данные для диаграммы статусов
    const statusChartData = [
        { status: 'Ожидание', count: stats.general_stats.pending_appointments, fill: '#FFA500' },
        { status: 'Подтверждено', count: stats.general_stats.confirmed_appointments, fill: '#007BFF' },
        { status: 'Завершено', count: stats.general_stats.completed_appointments, fill: '#28A745' },
        { status: 'Отменено', count: stats.general_stats.cancelled_appointments, fill: '#DC3545' }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📊 Панель управления</h1>
                <button onClick={fetchDashboardData} className="refresh-btn">
                    🔄 Обновить
                </button>
            </div>

            {/* Общая статистика */}
            <div className="stats-section">
                <h2>Общая статистика записей</h2>
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.general_stats.total_appointments}</div>
                            <div className="stat-label">Всего записей</div>
                        </div>
                    </div>

                    <div className="stat-card confirmed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.general_stats.confirmed_appointments}</div>
                            <div className="stat-label">Подтвержденные</div>
                            <div className="stat-percentage">{stats.general_stats.confirmed_rate}%</div>
                            <div className="stat-description">Коэффициент подтверждения</div>
                        </div>
                    </div>
                    <div className="stat-card completed">
                        <div className="stat-icon">🏁</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.general_stats.completed_appointments}</div>
                            <div className="stat-label">Завершенные</div>
                            <div className="stat-percentage">{stats.general_stats.completed_rate}%</div>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.general_stats.pending_appointments}</div>
                            <div className="stat-label">Ожидают подтверждения</div>
                            <div className="stat-percentage">{stats.general_stats.pending_rate}%</div>
                        </div>
                    </div>

                    <div className="stat-card cancelled">
                        <div className="stat-icon">❌</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.general_stats.cancelled_appointments}</div>
                            <div className="stat-label">Отмененные</div>
                            <div className="stat-percentage">{stats.general_stats.cancelled_rate}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Диаграмма статусов записей */}
            <div className="chart-section" style={{ marginBottom: '30px' }}>
                <h3>📊 Распределение записей по статусам</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="charts-container">
                {/* Популярные услуги */}
                <div className="chart-section">
                    <div className="section-header">
                        <h2>🏆 Популярные услуги</h2>
                        <span className="section-count">Топ-5</span>
                    </div>
                    <div className="services-list">
                        {stats.popular_services.map((service, index) => (
                            <div key={service.id} className="service-item">
                                <div className="item-rank">
                                    <div className="rank-badge">{index + 1}</div>
                                </div>
                                <div className="item-content">
                                    <div className="item-name">{service.name}</div>
                                    <div className="item-meta">
                                        <span className="appointment-count">{service.appointment_count} записей</span>
                                        <span className="separator">|</span>
                                        <span className="price">{service.price} руб.</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Популярные врачи */}
                <div className="chart-section">
                    <div className="section-header">
                        <h2>👨‍⚕️ Популярные врачи</h2>
                        <span className="section-count">Топ-5</span>
                    </div>
                    <div className="doctors-list">
                        {stats.popular_doctors.map((doctor, index) => (
                            <div key={doctor.id} className="doctor-item">
                                <div className="item-rank">
                                    <div className="rank-badge">{index + 1}</div>
                                </div>
                                <div className="item-content">
                                    <div className="doctor-name">{doctor.full_name}</div>
                                    <div className="doctor-meta">
                                        <span className="specialization">{doctor.specialization}</span>
                                        <span className="appointment-count">{doctor.appointment_count} записей</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Секция с графиками */}
                {!chartsLoading && (
                    <div className="charts-section">
                        <h2>📈 Расширенная аналитика</h2>

                        <div className="charts-grid">
                            {/* График тренда записей */}
                            <div className="chart-container">
                                <h3>Динамика записей за последние 30 дней</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* График загрузки врачей */}
                            <div className="chart-container">
                                <h3>Загрузка врачей (количество записей)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={workloadData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="appointment_count" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;






// // frontend/src/pages/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// // Импорты для графиков
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
//
//
//
// const AdminDashboard = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [trendData, setTrendData] = useState([]);
//     const [workloadData, setWorkloadData] = useState([]);
//     const [chartsLoading, setChartsLoading] = useState(true);
//
//     // useEffect(() => {
//     //     fetchDashboardData();
//     // }, []);
//
//     useEffect(() => {
//     const loadAllData = async () => {
//         setLoading(true);
//         setChartsLoading(true);
//
//         try {
//             await Promise.all([
//                 fetchDashboardData(),
//                 fetchChartsData()
//             ]);
//         } catch (error) {
//             console.error('Ошибка загрузки данных:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     loadAllData();
// }, []);
//
//     const fetchChartsData = async () => {
//     try {
//         // Загружаем данные для тренда записей
//         const trendResponse = await fetch('http://localhost:8000/api/analytics/appointments-trend/');
//         const trendData = await trendResponse.json();
//         setTrendData(trendData);
//
//         // Загружаем данные для загрузки врачей
//         const workloadResponse = await fetch('http://localhost:8000/api/analytics/doctor-workload/');
//         const workloadData = await workloadResponse.json();
//         setWorkloadData(workloadData);
//
//     } catch (error) {
//         console.error('Ошибка загрузки графиков:', error);
//     } finally {
//         setChartsLoading(false);
//     }
// };
//     const fetchDashboardData = async () => {
//         try {
//             const response = await fetch('http://localhost:8000/api/analytics/dashboard/');
//             if (!response.ok) throw new Error('Ошибка загрузки');
//             const data = await response.json();
//             setStats(data);
//         } catch (error) {
//             console.error('Ошибка:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (loading) return (
//         <div className="loading-container">
//             <div className="loading-spinner"></div>
//             <p>Загрузка статистики...</p>
//         </div>
//     );
//
//     if (!stats) return (
//         <div className="error-container">
//             <h2>❌ Ошибка загрузки данных</h2>
//             <button onClick={fetchDashboardData}>Повторить попытку</button>
//         </div>
//     );
//
//     return (
//         <div className="dashboard-container">
//             <div className="dashboard-header">
//                 <h1>📊 Панель управления</h1>
//                 <button onClick={fetchDashboardData} className="refresh-btn">
//                     🔄 Обновить
//                 </button>
//             </div>
//
//             {/* Общая статистика */}
//             <div className="stats-section">
//                 <h2>Общая статистика записей</h2>
//                 <div className="stats-grid">
//                     <div className="stat-card total">
//                         <div className="stat-icon">📅</div>
//                         <div className="stat-content">
//                             <div className="stat-number">{stats.general_stats.total_appointments}</div>
//                             <div className="stat-label">Всего записей</div>
//                         </div>
//                     </div>
//
//                     <div className="stat-card confirmed">
//                         <div className="stat-icon">✅</div>
//                         <div className="stat-content">
//                             <div className="stat-number">{stats.general_stats.confirmed_appointments}</div>
//                             <div className="stat-label">Подтвержденные</div>
//                             <div className="stat-percentage">{stats.general_stats.confirmed_rate}%</div>
//                             <div className="stat-description">Коэффициент подтверждения</div>
//                         </div>
//                     </div>
//                     <div className="stat-card completed">
//                         <div className="stat-icon">🏁</div>
//                         <div className="stat-content">
//                             <div className="stat-number">{stats.general_stats.completed_appointments}</div>
//                             <div className="stat-label">Завершенные</div>
//                             <div className="stat-percentage">{stats.general_stats.completed_rate}%</div>
//                         </div>
//                     </div>
//                     <div className="stat-card pending">
//                         <div className="stat-icon">⏳</div>
//                         <div className="stat-content">
//                             <div className="stat-number">{stats.general_stats.pending_appointments}</div>
//                             <div className="stat-label">Ожидают подтверждения</div>
//                             <div className="stat-percentage">{stats.general_stats.pending_rate}%</div>
//                         </div>
//                     </div>
//
//
//                     <div className="stat-card cancelled">
//                         <div className="stat-icon">❌</div>
//                         <div className="stat-content">
//                             <div className="stat-number">{stats.general_stats.cancelled_appointments}</div>
//                             <div className="stat-label">Отмененные</div>
//                             <div className="stat-percentage">{stats.general_stats.cancelled_rate}%</div>
//                         </div>
//                     </div>
//
//
//                     {/*<div className="stat-card rate">*/}
//                     {/*    <div className="stat-icon">📈</div>*/}
//                     {/*    <div className="stat-content">*/}
//                     {/*        <div className="stat-number">{stats.general_stats.confirmation_rate}%</div>*/}
//                     {/*        <div className="stat-label">Коэффициент подтверждения</div>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//                 </div>
//             </div>
//
//             <div className="charts-container">
//                 {/* Популярные услуги */}
//                 <div className="chart-section">
//                     <div className="section-header">
//                         <h2>🏆 Популярные услуги</h2>
//                         <span className="section-count">Топ-5</span>
//                     </div>
//                     <div className="services-list">
//                         {stats.popular_services.map((service, index) => (
//                             <div key={service.id} className="service-item">
//                                 <div className="item-rank">
//                                     <div className="rank-badge">{index + 1}</div>
//                                 </div>
//                                 <div className="item-content">
//                                     <div className="item-name">{service.name}</div>
//                                     <div className="item-meta">
//                                         <span className="appointment-count">{service.appointment_count} записей</span>
//                                         <span className="separator">|</span> {/* ← Разделитель */}
//                                         <span className="price">{service.price} руб.</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Популярные врачи */}
//                 <div className="chart-section">
//                     <div className="section-header">
//                         <h2>👨‍⚕️ Популярные врачи</h2>
//                         <span className="section-count">Топ-5</span>
//                     </div>
//                     <div className="doctors-list">
//                         {stats.popular_doctors.map((doctor, index) => (
//                             <div key={doctor.id} className="doctor-item">
//                                 <div className="item-rank">
//                                     <div className="rank-badge">{index + 1}</div>
//                                 </div>
//                                 <div className="item-content">
//                                     <div className="doctor-name">{doctor.full_name}</div>
//                                     <div className="doctor-meta">
//                                         <span className="specialization">{doctor.specialization}</span>
//                                         <span className="appointment-count">{doctor.appointment_count} записей</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//
//                     </div>
//                 </div>
//                         {/* Секция с графиками */}
//             {!chartsLoading && (
//                 <div className="charts-section">
//                     <h2>📈 Расширенная аналитика</h2>
//
//                     <div className="charts-grid">
//                         {/* График тренда записей */}
//                         <div className="chart-container">
//                             <h3>Динамика записей за последние 30 дней</h3>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <LineChart data={trendData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="date" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </div>
//
//                         {/* График загрузки врачей */}
//                         <div className="chart-container">
//                             <h3>Загрузка врачей (количество записей)</h3>
//                          <ResponsiveContainer width="100%" height={300}>
//                                 <BarChart data={workloadData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Bar dataKey="appointment_count" fill="#10b981" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             </div>
//         </div>
//     );
// };
//
// export default AdminDashboard;