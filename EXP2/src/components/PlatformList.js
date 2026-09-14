import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { platformsSelectors, platformToggled } from "../features/platforms/platformsSlice";

export default function PlatformList() {
  const platforms = useSelector(platformsSelectors.selectAll);
  const dispatch = useDispatch();

  return (
    <div className="panel">
      <h2>Platforms</h2>
      <ul className="platform-list">
        {platforms.map((platform) => (
          <li key={platform.id} className={platform.isActive ? "active" : "inactive"}>
            <span>{platform.name}</span>
            <span className="handle">{platform.handle}</span>
            <button onClick={() => dispatch(platformToggled(platform.id))}>
              {platform.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
