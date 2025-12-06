import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout('components/layout/AppLayout.tsx', [
        index("routes/home.tsx"),
        route('movie/:movieId', 'routes/movieDescription.tsx'),
        route('actor/:actorId', 'routes/actorDescription.tsx'),
        route('register', 'routes/register.tsx'),
        route('account', 'routes/account.tsx'),
    ]),
    route('login', 'routes/login.tsx'),
] satisfies RouteConfig;
