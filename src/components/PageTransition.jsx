import { motion as Motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

/**
 * Animate routes for the game.
 *
 * @param {Object} props The properties object
 * @param {Object[]} props.routes The routes to animate
 * @returns 
 */
export function AnimatedRoutes({ routes }) {
	const location = useLocation();
	const levelVariants = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
		exit: { opacity: 0, transition: { duration: 0.3, delay: 0.3 } },
	};
	const defaultVariants = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.3 } },
		exit: { opacity: 0, transition: { duration: 0.3 } },
	};
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				{routes.map(({ path, element }) => {
					const isLevelRoute = path.startsWith("/level/");
					const variant = isLevelRoute ? levelVariants : defaultVariants;
					return (
						<Route
							key={path}
							path={path}
							element={
								<Motion.div
									className="sr-page-transition"
									variants={variant}
									initial="initial"
									animate="animate"
									exit="exit"
								>
									{element}
								</Motion.div>
							}
						/>
					);
				})}
			</Routes>
		</AnimatePresence>
	);
}
