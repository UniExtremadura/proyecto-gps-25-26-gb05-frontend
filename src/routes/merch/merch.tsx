import React, { useState } from 'react';
import songCover from '/src/assets/songcover.jpg';

type Merch = {
	productName: string;
	productMerch: string;
	productType: string;
	productPrice: string;
	productDescription: string;
	productImage: string;
};

const sampleMerch: Merch = {
	productName: 'Sudadera Album1',
	productMerch: 'album1',
	productType: 'hoodie',
	productPrice: '10 €',
	productDescription:
		'Lorem ipsum dolor sit amet consectetur adipiscing elit proin himenaeos cum, suspendisse aptent ultricies mi pellentesque metus eget primis pharetra. Risus proin neque auctor sodales at ligula feugiat eu felis class, sociosqu odio tempor gravida viverra metus justo iaculis phasellus, donec ut sapien quis placerat mauris commodo pretium fringilla. Nisl rhoncus ac velit placerat fusce hendrerit netus platea auctor, non risus convallis maecenas proin hac lobortis mi, integer lacus inceptos sodales porta ultrices elementum lectus.',
	productImage: songCover,
};

function MerchView() {
	const [merch, setMerch] = useState<Merch>(sampleMerch);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleDeleteClick = () => {
		//llamada al endpoint
		setDeleteOpen(false);
		//volver al perfil
	};
	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<div className="max-w-6x1 mx-auto flex flex-col md:flex-row gap-8 ">
				<div className="p-30 w-full md:w-1/2 flex-shrink-0">
					<img
						src={merch.productImage}
						className="max-w-100 w-full h-auto object-cover rounded-lg shadows-2x1"
						alt="Portada de la Canción"
					/>
				</div>

				<div className="w-full md:w-1/2">
					<>
						<h1 className="text-3xl lg:text-4x1 font-bold text-center mt-1">
							{merch.productType} {merch.productMerch}
						</h1>

						<button className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
							Añadir al carrito
						</button>

						<button
							onClick={() => setDeleteOpen(true)}
							className="btn btn-secondary bg-red-500 btn-xs sm:btm-sm md:btn-md lg:btn-lg xl:btn-xl"
						>
							Eliminar canción
						</button>

						<div className="mt-8">
							<h3 className="text-xl font-bold text-center mt-2">Descripción</h3>
							<p className="whitespace-pre-wrap leading-relaxed">
								{merch.productDescription}
							</p>
						</div>
					</>
				</div>
			</div>
			{deleteOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
					aria-modal="true"
					role="dialog"
				>
					<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
						<h3 className="text-2xl font-bold text-black mb-4">
							Confirmar Eliminación
						</h3>
						<p className="text-black mb-6">
							¿Estás seguro de que quieres eliminar esta canción? Esta acción es
							permanente y no se puede deshacer.
						</p>
						<div className="flex justify-end gap-4">
							<button
								type="button"
								onClick={() => setDeleteOpen(false)}
								className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleDeleteClick}
								className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
							>
								Eliminar Permanentemente
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MerchView;
