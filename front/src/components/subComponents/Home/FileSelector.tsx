import { forwardRef, Ref, useState, Fragment } from "react";

export interface FileSelectorProps {
	id: string;
}

const FileSelector = forwardRef(
	({ id }: FileSelectorProps, ref: Ref<HTMLInputElement>) => {
		const [filename, setFilename] = useState("No File Selected");
		return (
			<Fragment>
				<label htmlFor={id}>
					<div className="border-[1px] border-[#b8b8b8] text-center cursor-pointer">
						{filename}
					</div>
				</label>
				<input
					type="file"
					ref={ref}
					className="hidden"
					id={id}
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0)
							setFilename(e.target.files[0].name);
						else setFilename("No File Selected");
					}}
				/>
			</Fragment>
		);
	}
);
export { FileSelector };
