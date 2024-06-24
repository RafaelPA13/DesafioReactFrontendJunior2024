import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";

interface TarefaProps {
  tarefa: {
    id: string;
    title: string;
    isDone: boolean;
  };
  feito: () => void;
  editar: (novoTitulo: string) => void;
  deletar: () => void;
}

export default function Tarefa({
  tarefa,
  feito,
  editar,
  deletar,
}: TarefaProps) {
  const [editando, setEditando] = useState(false);
  const [editarTexto, setEditarTexto] = useState(tarefa.title);

  const duploClique = () => {
    setEditando(true);
  };

  const identificadorDeMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditarTexto(e.target.value);
  };

  const precionarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      salvarEdicao();
    }
  };

  const salvarEdicao = () => {
    editar(editarTexto);
    setEditando(false);
  };

  return (
    <li className={tarefa.isDone ? "tarefasConcluidas" : "tarefas"}>
      <div onDoubleClick={duploClique}>
        {editando ? (
          <input
            type="text"
            className="inputTarefas"
            value={editarTexto}
            onChange={identificadorDeMudanca}
            onBlur={salvarEdicao}
            onKeyPress={precionarEnter}
            autoFocus
          />
        ) : (
          <>
            <input type="checkbox" checked={tarefa.isDone} onChange={feito} />
            <p>{tarefa.title}</p>
          </>
        )}
      </div>
      <button onClick={deletar}>
        <TiDelete />
      </button>
    </li>
  );
}
