import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incremented,
  decremented,
  incrementedByAmount,
  reset,
} from "../features/counter/counterSlice";
import { selectCount } from "../features/counter/counterSlice";

export default function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(5);

  return (
    <div className="panel counter">
      <h2>Counter</h2>
      <div className="counter-value">{count}</div>
      <div className="post-actions">
        <button onClick={() => dispatch(decremented())}>-</button>
        <button onClick={() => dispatch(incremented())}>+</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>
      <div className="counter-custom">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={() => dispatch(incrementedByAmount(amount))}>
          Add Amount
        </button>
      </div>
    </div>
  );
}
