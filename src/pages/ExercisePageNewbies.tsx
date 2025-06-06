import { useState } from "react";
import { Link } from "react-router";
import { useProgress } from "../hooks/ExerciseContext";
import confetti from "canvas-confetti";

interface Quizz {
	instruction: string;
	rightAnswer: string[];
	choices: string[];
}

function ExercisePageNewbies() {
	const { setProgress } = useProgress();
	const handleNewbiesDone = () => {
		setProgress((el) => ({ ...el, newbie: true }));
	};
	const quizz: Quizz[] = [
		{
			instruction: "Afficher 'Hello World'",
			rightAnswer: ["console.log(", "'Hello World');"],
			choices: ["'Hello World');", "console.log("],
		},
		{
			instruction: "Stocker la valeur 5 dans la variable x",
			rightAnswer: ["const ", " x ", "=", " 5;"],
			choices: ["=", " 5;", " x ", "const "],
		},
		{
			instruction: "Afficher la somme de deux nombres a et b",

			rightAnswer: ["console.log(", "a", " + ", "b);"],
			choices: ["b);", " + ", "console.log(", "a"],
		},
	];
	const [userAnswer, setUserAnswer] = useState<string[]>([]);
	const [feedback, setFeedback] = useState<string>("");
	const [question, setquestion] = useState(0);
	const current = quizz[question];
	const feedbackValue = ["valid", "invalid", "done"];
	const showButton = feedbackValue.includes(feedback);

	// This allows the answer to be displayed end by end
	const handleClick = (newEl: string) => {
		if (userAnswer.length < current.rightAnswer.length) {
			setUserAnswer([...userAnswer, newEl]);
		}
	};

	const handleMissClick = () => {
		setUserAnswer(userAnswer.slice(0, -1));
	};

	// Allows to compare arrays
	const handleValidate = () => {
		if (JSON.stringify(userAnswer) === JSON.stringify(current.rightAnswer)) {
			setFeedback("valid");
		} else {
			setFeedback("invalid");
		}
	};

	// Reset if userAnswer is wrong
	const handleReset = () => {
		setUserAnswer([]);
		setFeedback("");
	};

	/* 
	Checks if we're not at the last question, 
	if not we go to the next question and reset all
	*/
	const handleNext = () => {
		if (question < quizz.length - 1) {
			setquestion(question + 1);
			handleReset();
		} else {
			setFeedback("done");
			sendConfettis();
		}
	};

	// Confettis !!!
	const sendConfettis = () => {
		confetti({
			particleCount: 550,
			spread: 180,
			origin: { y: 0.5 },
			ticks: 2000,
		});
	};

	return (
		<main className="text-center min-h-[calc(100vh-100px)] px-2 py-8 animate-fade-in">
			<section className="flex flex-col items-center gap-6 md:gap-10 max-w-3xl mx-auto">
				<h2 className="font-bold text-2xl md:text-4xl">
					{current.instruction}
				</h2>
				<div className="relative bg-[#1E1E1E] rounded-2xl shadow-xl p-10 w-[80%]">
					<div className="absolute top-4 left-4 flex space-x-2">
						<span className="w-3 h-3 bg-red-500 rounded-full" />
						<span className="w-3 h-3 bg-yellow-500 rounded-full" />
						<span className="w-3 h-3 bg-green-500 rounded-full" />
					</div>
					<article className="mt-4 flex flex-wrap justify-center gap-2">
						{userAnswer.map((el) => (
							<span
								key={el}
								className="py-1  text-white rounded-2xl text-lg md:text-xl animate-fade-in-answer"
							>
								{el}
							</span>
						))}
					</article>
				</div>

				<article className="flex justify-center gap-3 flex-wrap mt-4 ">
					{current.choices.map((el) => (
						<button
							type="button"
							key={el}
							onClick={() => handleClick(el)}
							className="cursor-pointer px-6 py-3 font-bold bg-amber-50 rounded-2xl text-lg md:text-xl hover:bg-amber-100 border-1 border-primary text-primary"
						>
							{el}
						</button>
					))}
				</article>
				{!showButton && (
					<div className="flex gap-5 justify-center mt-5 ">
						<button
							type="button"
							onClick={handleMissClick}
							className="cursor-pointer p-3 px-12 md:p-4 md:px-16 bg-primary text-white w-fit mx-auto rounded-2xl mt-4 text-lg md:text-xl hover:bg-[#326708]"
						>
							<img
								src="/assets/undo.png"
								alt="delete last input"
								className="invert w-7 h-7"
							/>
						</button>

						<button
							type="button"
							onClick={handleValidate}
							className="cursor-pointer p-3 px-12 md:p-4 md:px-16 bg-primary text-white w-fit mx-auto rounded-2xl mt-4 text-lg md:text-xl hover:bg-[#326708]"
						>
							Valider
						</button>
					</div>
				)}

				{feedback === "valid" && (
					<article className="mt-6 flex flex-col items-center animate-fade-in">
						<button
							type="button"
							onClick={handleNext}
							className="cursor-pointer mt-2 px-12 p-3 md:p-4 md:px-16 bg-primary text-white rounded-2xl text-lg md:text-xl hover:bg-[#326708]"
						>
							Question suivante
						</button>
						<img
							src="/assets/happy.png"
							alt="avatar with happy face"
							className="w-50 md:w-100 mt-12 md:mt-25 animate-bounce"
						/>
					</article>
				)}

				{feedback === "invalid" && (
					<article className="mt-6 flex flex-col items-center animate-fade-in">
						<button
							type="button"
							onClick={handleReset}
							className="mt-2 p-3 px-12 md:p-4 md:px-16 bg-primary text-white rounded-2xl text-lg md:text-xl hover:bg-[#326708]"
						>
							Réessayer
						</button>
						<img
							src="/assets/sad.png"
							alt="avatar with sad face"
							className="w-50 md:w-100 animate-pulse"
						/>
					</article>
				)}

				{feedback === "done" && (
					<article className="mt-6 flex flex-col items-center animate-fade-in">
						<Link
							to="/"
							className="mt-2 p-3 px-12 md:p-4 md:px-16 bg-primary text-white rounded-2xl text-lg md:text-xl hover:bg-[#326708]"
							onClick={handleNewbiesDone}
						>
							Retourner à l'accueil
						</Link>
						<img
							src="/assets/happy.png"
							alt="avatar with happy face"
							className="w-50 md:w-100 mt-12 md:mt-25 animate-bounce"
						/>
					</article>
				)}
			</section>
		</main>
	);
}
export default ExercisePageNewbies;
