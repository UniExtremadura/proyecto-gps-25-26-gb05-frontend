import React, { useState } from 'react';
import songCover from '/src/assets/songcover.jpg';
import sampleAudio from '/src/assets/sample.mp3';

type Song = {
	title: string;
	artist: string;
	cover: string;
	audio: string;
	digitalPrice: string;
	cdPrice: string;
	vinylPrice: string;
	currPrice: string;
	description: string;
};

const sampleSong: Song = {
	title: 'SongName',
	artist: 'Artist',
	cover: songCover,
	audio: sampleAudio,
	digitalPrice: '10€ ',
	cdPrice: '15€ ',
	vinylPrice: '30€ ',
	currPrice: '10€ ',
	description:
		'Lorem ipsum dolor sit amet consectetur adipiscing elit proin himenaeos cum, suspendisse aptent ultricies mi pellentesque metus eget primis pharetra. Risus proin neque auctor sodales at ligula feugiat eu felis class, sociosqu odio tempor gravida viverra metus justo iaculis phasellus, donec ut sapien quis placerat mauris commodo pretium fringilla. Nisl rhoncus ac velit placerat fusce hendrerit netus platea auctor, non risus convallis maecenas proin hac lobortis mi, integer lacus inceptos sodales porta ultrices elementum lectus.',
};
function SongView() {
	const [song, setSong] = useState<Song>(sampleSong);
	const [isEditing, setEditing] = useState(false);
	const [editableSong, setEditableSong] = useState<Song>(song);
	const [format, setFormat] = useState<string>('digital');
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setEditableSong((prevSong) => ({
			...prevSong,
			[name]: value,
		}));
	};

	const handleSave = () => {
		setSong(editableSong);
		setEditing(false);
	};

	const handleEditClick = () => {
		setEditing(true);
		setEditableSong(song);
	};

	const handleFormatSelect = (e: any) => {
		setFormat(e.target.value);
	};
	const handleDeleteClick = () => {
		//llamada al endpoint borrarCancion
		setDeleteOpen(false);
		setEditing(false);
		//volver al perfil
	};
	const handleCancelClick = () => {
		setEditableSong(song);
		setEditing(false);
	};
	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<div className="max-w-6x1 mx-auto flex flex-col md:flex-row gap-8 ">
				<div className="p-30 w-full md:w-1/2 flex-shrink-0">
					<img
						src={editableSong.cover}
						className="max-w-100 w-full h-auto object-cover rounded-lg shadows-2x1"
						alt="Portada de la Canción"
					/>
				</div>

				<div className="w-full md:w-1/2">
					<div className="flex gap-4 mb-6">
						{!isEditing ? (
							<button
								onClick={handleEditClick}
								className="bg-blue-500 hover:bg-blue-600 text-white
							font-bold py-2 px-4 rounded-md transition-colors duration-200"
							>
								Editar
							</button>
						) : (
							<>
								<button
									onClick={handleSave}
									className="bg-green-500 hover:bg-green-600 text-white
							font-bold py-2 px-4 rounded-md transition-colors duration-200"
								>
									Guardar Cambios
								</button>
								<button
									onClick={handleCancelClick}
									className="bg-gray-500 hover:bg-gray-600 text-white
					font-bold py-2 px-4 rounded-md transition-colors duration-200"
								>
									Cancelar
								</button>

								<button
									onClick={() => setDeleteOpen(true)}
									className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
								>
									Eliminar canción
								</button>
							</>
						)}
					</div>
					{!isEditing ? (
						<>
							<h1 className="text-3xl lg:text-4x1 font-bold text-center mt-1">
								{editableSong.title}
							</h1>
							<h2 className="text-2xl lg:text-2x1 font-bold text-center mt-6">
								By: {editableSong.artist}
							</h2>

							<div className="my-4">
								<audio controls className="w-full">
									<source src={editableSong.audio} type="audio/mp3" />
								</audio>
							</div>

							<button type="button" className="btn btn-primary">
								Añadir al carrito
							</button>

							<select
								value={format}
								name="format"
								defaultValue="digital"
								onChange={handleFormatSelect}
								className="select max-w-30"
							>
								<option value="digital">Digital</option>
								<option value="cd">CD</option>
								<option value="vinyl">Vinilo</option>
								<option value="cassette">Casete</option>
							</select>

							<div className="mt-8">
								<h3 className="text-xl font-bold text-center mt-2">Descripción</h3>
								<p className="whitespace-pre-wrap leading-relaxed">
									{editableSong.description}
								</p>
							</div>
						</>
					) : (
						<form className="flex flex-col gap-2">
							<div>
								<label className="block text-sm font-medium text-black-300 mb-1">
									Titulo:{' '}
								</label>
								<input
									type="text"
									name="title"
									value={editableSong.title}
									onChange={handleInputChange}
									className="w-full bg-white border border-gray-700 text-black rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-black-300 mb-1">
									Autor:{' '}
								</label>
								<input
									type="text"
									name="artist"
									value={editableSong.artist}
									onChange={handleInputChange}
									className="w-full bg-white border border-gray-700 text-black rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div>
								<label className="label">Precio: </label>
								<input
									type="text"
									name="digitalPrice"
									value={editableSong.digitalPrice}
									onChange={handleInputChange}
									className="w-full bg-white border border-gray-700 text-black rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
								/>

								<label className="block text-sm font-medium text-black-300 mb-1">
									Descripción:{' '}
								</label>
								<input
									type="text"
									name="description"
									value={editableSong.description}
									onChange={handleInputChange}
									className="w-full bg-white border border-gray-700 text-black rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</form>
					)}
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

export default SongView;
