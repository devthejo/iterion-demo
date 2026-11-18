import { useState } from "react";
import { formatCents, parseEuros } from "./lib/money";
import { splitBill, totalWithTip } from "./lib/split";
import "./App.css";

const TIPS = [0, 5, 10, 15];

export default function App() {
  const [amount, setAmount] = useState("100");
  const [tip, setTip] = useState(0);
  const [people, setPeople] = useState(["Ana", "Bob", "Chloé"]);
  const [newName, setNewName] = useState("");

  const totalCents = parseEuros(amount);
  const billCents = totalCents === null ? null : totalWithTip(totalCents, tip);
  const shares = totalCents === null ? [] : splitBill(totalCents, people, tip);
  const sharesCents = shares.reduce((sum, s) => sum + s.cents, 0);
  const gap = billCents === null ? 0 : sharesCents - billCents;

  function addPerson(event: React.FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (name === "" || people.includes(name)) return;
    setPeople([...people, name]);
    setNewName("");
  }

  return (
    <main className="card">
      <header>
        <h1>Partage d'addition</h1>
        <p className="subtitle">Qui paie combien, au centime près.</p>
      </header>

      <label className="field">
        <span>Montant de l'addition</span>
        <div className="amount">
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={totalCents === null}
          />
          <span>€</span>
        </div>
      </label>

      <fieldset className="field">
        <legend>Pourboire</legend>
        <div className="tips">
          {TIPS.map((t) => (
            <button
              key={t}
              type="button"
              className={t === tip ? "chip active" : "chip"}
              onClick={() => setTip(t)}
            >
              {t} %
            </button>
          ))}
        </div>
      </fieldset>

      <section className="field">
        <span>Convives</span>
        <ul className="people">
          {shares.map((share) => (
            <li key={share.name}>
              <span className="name">{share.name}</span>
              <span className="share">{formatCents(share.cents)}</span>
              <button
                type="button"
                className="remove"
                aria-label={`Retirer ${share.name}`}
                onClick={() => setPeople(people.filter((p) => p !== share.name))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <form className="add" onSubmit={addPerson}>
          <input
            placeholder="Ajouter un convive"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit">Ajouter</button>
        </form>
      </section>

      {billCents !== null && people.length > 0 && (
        <footer className={gap === 0 ? "check ok" : "check ko"}>
          <div>
            <span>Addition</span>
            <strong>{formatCents(billCents)}</strong>
          </div>
          <div>
            <span>Total des parts</span>
            <strong>{formatCents(sharesCents)}</strong>
          </div>
          <p>
            {gap === 0
              ? "Le compte est bon."
              : `Écart de ${Math.abs(gap)} centime${Math.abs(gap) > 1 ? "s" : ""}.`}
          </p>
        </footer>
      )}
    </main>
  );
}
