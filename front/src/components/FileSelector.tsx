import { forwardRef, Ref, useId, useState, Fragment } from "react";

export interface FileSelectorProps {}

const FileSelector = forwardRef(
	(_: FileSelectorProps, ref: Ref<HTMLInputElement>) => {
		const id = useId();
		const [filename, setFilename] = useState("No File Selected");
		return (
			<Fragment>
				<label htmlFor={id}>
					<div className="border-solid border-black border-2 text-center cursor-pointer">
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
