import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao buscar dados");
  }

  const data = await response.json();
  return data;
}

export default function StatusPage() {
  const { data, isLoading, error } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  const getStatusColor = () => {
    if (!data?.database) return "#6b7280";
    const usage =
      (data.database.used_connections / data.database.max_connections) * 100;
    if (usage < 50) return "#10b981";
    if (usage < 80) return "#f59e0b";
    return "#ef4444";
  };

  const getConnectionPercentage = () => {
    if (!data?.database) return 0;
    return (
      (data.database.used_connections / data.database.max_connections) * 100
    );
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .status-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .header-title p {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .loading {
          text-align: center;
          color: #94a3b8;
          padding: 5rem 0;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #334155;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #334155;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          margin-bottom: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .badge {
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .metric-box {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 0.75rem;
          padding: 1.25rem;
        }

        .metric-label {
          color: #cbd5e1;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
          display: block;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: white;
        }

        .metric-value-large {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
        }

        .metric-unit {
          color: #94a3b8;
          font-size: 0.85rem;
          margin-left: 0.5rem;
        }

        .metric-info {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #475569;
          border-radius: 1rem;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          border-radius: 1rem;
          transition: width 0.5s ease-out, background-color 0.3s ease;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .update-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-circle {
          width: 40px;
          height: 40px;
          background: #334155;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-circle svg {
          width: 20px;
          height: 20px;
          color: #cbd5e1;
        }

        .update-content {
          flex: 1;
        }

        .update-label {
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        .update-time {
          color: white;
          font-weight: 500;
        }

        .update-interval {
          font-size: 0.75rem;
          color: #64748b;
          margin-left: auto;
        }

        .error-card {
          background: rgba(127, 29, 29, 0.3);
          border: 1px solid #991b1b;
        }

        .error-icon {
          width: 48px;
          height: 48px;
          background: #7f1d1d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .error-icon svg {
          width: 24px;
          height: 24px;
          color: #fca5a5;
        }

        .error-content {
          flex: 1;
        }

        .error-title {
          color: #fca5a5;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .error-message {
          color: #fecaca;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .error-detail {
          color: #fca5a5;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          font-style: italic;
        }

        .error-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .header-title h1 {
            font-size: 2rem;
          }
          
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="status-page">
        <div className="container">
          <div className="header">
            <div className="header-title">
              <h1>Status do Sistema</h1>
              <p>Monitoramento em tempo real</p>
            </div>
            <div className="status-indicator">
              <div
                className="status-dot"
                style={{
                  backgroundColor: error ? "#ef4444" : getStatusColor(),
                }}
              ></div>
              <span className="status-text">
                {error ? "Falha na conexão" : "Operacional"}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              Carregando...
            </div>
          ) : error ? (
            <div className="card error-card">
              <div className="error-info">
                <div className="error-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="error-content">
                  <h3 className="error-title">Falha na Conexão</h3>
                  <p className="error-message">
                    Não foi possível conectar ao servidor. Tentando reconectar
                    automaticamente...
                  </p>
                  <p className="error-detail">{error.message}</p>
                </div>
              </div>
            </div>
          ) : data && data.database ? (
            <>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Banco de Dados</h2>
                  <span className="badge">
                    PostgreSQL {data.database.version}
                  </span>
                </div>

                <div className="grid">
                  <div className="metric-box">
                    <div className="metric-header">
                      <span className="metric-label">Conexões Ativas</span>
                      <span className="metric-value">
                        {data.database.used_connections}
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${getConnectionPercentage()}%`,
                          backgroundColor: getStatusColor(),
                        }}
                      ></div>
                    </div>

                    <div className="progress-labels">
                      <span>0</span>
                      <span>{getConnectionPercentage().toFixed(1)}%</span>
                      <span>{data.database.max_connections}</span>
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Conexões Máximas</span>
                    <div>
                      <span className="metric-value-large">
                        {data.database.max_connections}
                      </span>
                      <span className="metric-unit">conexões</span>
                    </div>
                    <div className="metric-info">
                      Disponíveis:{" "}
                      {data.database.max_connections -
                        data.database.used_connections}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="update-info">
                  <div className="icon-circle">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="update-content">
                    <p className="update-label">Última atualização</p>
                    <p className="update-time">
                      {new Date(data.updated_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <span className="update-interval">Atualiza a cada 2s</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
