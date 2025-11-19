import React from 'react';
import type { HelpCategory } from '../../contexts/help.context';

interface HelpArticleCardProps {
	uuid: string;
	title: string;
	category: HelpCategory;
	setSelectedId: (id: string) => void;
}

const HelpArticleCard: React.FC<HelpArticleCardProps> = ({
	uuid,
	title,
	category,
	setSelectedId,
}) => {
	return (
		<div
			key={uuid}
			className="card bg-base-200 shadow-sm hover:shadow-md transition-all"
		>
			<div className="card-body">
				<h2 className="card-title text-lg font-semibold">{title}</h2>
				<p className="text-sm opacity-70">{category}</p>
				<div className="card-actions justify-end mt-4 gap-2">
					<button
						className="btn btn-sm btn-outline"
						onClick={() => setSelectedId(uuid)}
					>
						Leer más
					</button>
				</div>
			</div>
		</div>
	);
};

export default HelpArticleCard;
