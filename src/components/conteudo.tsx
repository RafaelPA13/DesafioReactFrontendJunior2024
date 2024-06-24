import React, { useEffect, useState } from "react";
//Importe de icones
import { MdKeyboardArrowDown } from "react-icons/md";
//Importe do banco de dados
import { db } from "../services/firebase";
//Importe de componentes
import Tarefa from "./tarefa";
//Importe firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { title } from "process";

interface Tarefas {
  id: string;
  title: string;
  isDone: boolean;
}

interface ConteudoProps {
  filtro: "all" | "active" | "completed";
}

export default function Conteudo({ filtro }: ConteudoProps) {
  //States
  const [tarefas, setTarefas] = useState<Tarefas[]>([]);
  const [input, setInput] = useState("");

  //CRUD
  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.length > 2)
      await addDoc(collection(db, "todo"), {
        title: input,
        isDone: false,
      } as Tarefas);
    setInput("");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "todo")),
      (querySnapshot) => {
        const listaDeTareafas: Tarefas[] = [];
        querySnapshot.forEach((doc) => {
          listaDeTareafas.push({ ...doc.data(), id: doc.id } as Tarefas);
        });
        setTarefas(listaDeTareafas);
      }
    );
    return () => unsubscribe();
  }, []);

  const feito = async (id: string, isDone: boolean) => {
    await updateDoc(doc(db, "todo", id), { isDone: !isDone });
  };

  const editar = async (id: string, novoTitulo: string) => {
    await updateDoc(doc(db, "todo", id), { title: novoTitulo });
    setTarefas((prevTarefas) =>
      prevTarefas.map((t) => (t.id === id ? { ...t, title: novoTitulo } : t))
    );
  };

  const deletar = async (id: string) => {
    await deleteDoc(doc(db, "todo", id));
  };

  //Funções extras
  const marcarTodasConcluidas = async () => {
    const batch = writeBatch(db);
    tarefas.forEach((tarefa) => {
      const tarefaRef = doc(db, "todo", tarefa.id);
      batch.update(tarefaRef, { isDone: !tarefa.isDone });
    });
    await batch.commit();
    setTarefas((prevTarefas) =>
      prevTarefas.map((t) => ({ ...t, isDone: !t.isDone }))
    );
  };

  const deletarTarefasConcluidas = async () => {
    const q = query(collection(db, "todo"), where("isDone", "==", true));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    setTarefas((prevTarefas) => prevTarefas.filter((t) => !t.isDone));
  };

  //Filtragem
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "all") return true;
    if (filtro === "active") return !tarefa.isDone;
    if (filtro === "completed") return tarefa.isDone;
    return true;
  });

  //Importe das tarefas iniciais via API
  //   useEffect(() => {
  //     const url = new URL(
  //       "https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos"
  //     );

  //     fetch(url.toString())
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setTarefas(data);
  //       });
  //   }, []);

  return (
    <div className="container">
      <h1>todos</h1>
      <div className="formTarefas">
        <button onClick={marcarTodasConcluidas}>
          <MdKeyboardArrowDown />
        </button>
        <form onSubmit={criar}>
          <input
            type="text"
            className="inputTarefas"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </form>
      </div>
      <ul className="listaDeTareafas">
        {/* Mapeamento das tarefas */}
        {tarefasFiltradas.map((tarefa) => {
          return (
            <Tarefa
              key={tarefa.id}
              tarefa={tarefa}
              feito={() => feito(tarefa.id, tarefa.isDone)}
              editar={(novoTitulo) => editar(tarefa.id, novoTitulo)}
              deletar={() => deletar(tarefa.id)}
            />
          );
        })}
      </ul>
      <div className={tarefas.length === 0 ? "esconder" : "filtros"}>
        <p>
          {tarefas.length} {tarefas.length === 1 ? "item left!" : "items left!"}
        </p>
        <ul>
          <li>
            <a href="/">All</a>
          </li>
          <li>
            <a href="/active">Active</a>
          </li>
          <li>
            <a href="/completed">Completed</a>
          </li>
        </ul>
        <button onClick={deletarTarefasConcluidas}>Clear Completed</button>
      </div>
      <ul className="instrucoes">
        <li>Double-click to edit a todo</li>
        <li>Created by the TodoMVC Team</li>
        <li>Part of TodoMVC</li>
      </ul>
    </div>
  );
}
