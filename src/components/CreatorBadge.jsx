import React, { useState } from "react";
import { FaUser, FaCode } from "react-icons/fa";

const CreatorBadge = () => {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div
			className="creator-badge"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<div className="badge-icon">
				<FaCode />
			</div>

			{showTooltip && (
				<div className="creator-tooltip">
					<div className="tooltip-content">
						<div className="creator-mini-avatar">
							<img
								src="/assets/karla-avatar.jpg"
								alt="Karla Daiany"
								onError={(e) => {
									e.target.style.display = "none";
									e.target.nextSibling.style.display = "flex";
								}}
							/>
							<div
								className="mini-avatar-fallback"
								style={{ display: "none" }}
							>
								KD
							</div>
						</div>
						<div className="tooltip-info">
							<span className="tooltip-name">Karla Daiany</span>
							<span className="tooltip-role">
								QA Lead 🤖 Automation
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreatorBadge;
