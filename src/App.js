import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repos, setRepos] = useState([]);
  const [formData, setFormData] = useState({ url: "", title: "", techs: "" });

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepos(response.data);
    });
  }, []);

  async function handleAddRepository(e) {
    try {
      e.preventDefault();

      const { data } = await api.post("/repositories", {
        ...formData,
        techs: formData.techs.split(",").map((item) => item.trim()),
      });

      setFormData({ url: "", title: "", techs: "" });
      setRepos([...repos, data]);
    } catch (e) {
      alert("Algo deu errado, verifique os dados e tente novamente.");
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);
      setRepos(repos.filter((repos) => repos.id !== id));
    } catch (e) {
      alert("Algo deu errado, tente novamente");
    }
  }

  return (
    <div className="main">
      <ul data-testid="repository-list">
        {repos.map(({ id, title, techs, url }) => (
          <li key={id}>
            <div className="repository-info">
              <h3>{title}</h3>
              <span>
                {techs.map((tech, index) => (index === 0 ? tech : `, ${tech}`))}
              </span>
              <a href={url}>> acessar</a>
            </div>
            <button onClick={() => handleRemoveRepository(id)}>Remover</button>
          </li>
        ))}
      </ul>
      <form>
        <div className="inputGroup">
          <label>URL do repositório</label>
          <input
            name="url"
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div className="inputGroup">
          <label>Nome do repositório</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="inputGroup">
          <label>Tecnologias (separado por vírgula)</label>
          <input
            name="techs"
            type="text"
            value={formData.techs}
            onChange={(e) =>
              setFormData({ ...formData, techs: e.target.value })
            }
          />
        </div>
        <button onClick={(e) => handleAddRepository(e)}>Adicionar</button>
      </form>
    </div>
  );
}

export default App;
