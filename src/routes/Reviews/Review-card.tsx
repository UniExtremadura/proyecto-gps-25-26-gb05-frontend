import React from 'react';

interface ReviewCardProps {
	userName: string;
	rating: number;
	title: string;
	content: string;
	date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
	userName,
	rating,
	title,
	content,
	date,
}) => {
	return (
		<div className="card bg-base-100 shadow">
			<div className="card-body">
				<h4 className="font-semibold">{userName}</h4>
				<div className="rating rating-sm mb-1">
					<input
						type="radio"
						className="mask mask-star"
						checked={rating > 0}
						readOnly
					/>
					<input
						type="radio"
						className="mask mask-star"
						checked={rating > 1}
						readOnly
					/>
					<input
						type="radio"
						className="mask mask-star"
						checked={rating > 2}
						readOnly
					/>
					<input
						type="radio"
						className="mask mask-star"
						checked={rating > 3}
						readOnly
					/>
					<input
						type="radio"
						className="mask mask-star"
						checked={rating > 4}
						readOnly
					/>
				</div>
				<h5 className="font-medium">{title}</h5>
				<p>{content}</p>
				<span className="text-sm opacity-60">{date}</span>
			</div>
		</div>
	);
};

export default ReviewCard;
