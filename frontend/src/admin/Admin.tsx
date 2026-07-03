import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthService } from "../services/auth.service";
import usePopupService from "../services/popup.service";
import React, { Suspense, lazy, useEffect } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FeatureDefinition {
    name: string;
    description: string;
    routeName: string;
    component: React.ComponentType;
}

const AdminBoard = lazy(() => import("./AdminBoard"));
const ListRadiusUsers = lazy(() => import("./admin-features/ListRadiusUsers/ListRadiusUsers"));
const UserCreation = lazy(() => import("./admin-features/UserCreation"));
const UsersManager = lazy(() => import("./admin-features/UsersManager"));

const Loading = () => <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;

const adminBasePath = "/admin/login";

function ProtectedRoute(props: { path: string; child: React.ReactNode }) {
    const authService = useAuthService();
    const popupService = usePopupService();
    const navigate = useNavigate();

    const connected = authService.user.uid !== undefined;
    const admin = authService.user.is_admin;

    useEffect(() => {
        if (!connected) {
            authService
                .loginFromIDAndToken()
                .then((isAdmin: boolean) => {
                    if (isAdmin) {
                        navigate(props.path, { replace: true });
                    }
                })
                .catch((error) => {
                    if (error.message === "Pas d'ID utilisateur stocké localement") {
                        return;
                    }
                    const errorStatus = error.response.status;
                    switch (errorStatus) {
                        case 400:
                            break; // This status code means no token was sent, we don't need to inform the user
                        case 401: {
                            popupService.changePopup({
                                status: "error",
                                message: "Le cookie d'authentification a expiré, connexion automatique impossible",
                            });
                            break;
                        }
                    }
                });
        } else {
            if (!admin) {
                popupService.changePopup({ status: "error", message: "Accès interdit" });
                console.log("go back to home, you should't be there !");
            }
        }
    }, [authService.user]);
    return admin ? props.child : <Navigate to={adminBasePath} replace />;
}

export default function Admin() {
    const authService = useAuthService();
    const navigate = useNavigate();

    const featuresDefinition: FeatureDefinition[] = [
        // Name, description & component to display
        {
            name: "Gestion des comptes",
            description: "Pour gérer les comptes présents sur la base de données",
            routeName: "gestion",
            component: UsersManager,
        },
        {
            name: "Créer des comptes",
            description: "Pour créer des comptes à partir d'Excel avec les cotisations déjà enregistrées",
            routeName: "creation",
            component: UserCreation,
        },
        {
            name: "Comptes Radius",
            description: "Pour avoir la liste des comptes inscrits en temps réel sur le radius",
            routeName: "list-radius",
            component: ListRadiusUsers,
        },
    ];

    const featureComponent = (feature: FeatureDefinition) => {
        return (
            <div className="admin-feature-container">
                <span
                    className="retour-board-admin"
                    onClick={() => {
                        navigate("/admin/board", { replace: true });
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} /> Retour
                </span>
                <h2 className="titre-page-admin"> {feature.name} </h2>
                <div className="feature-view">
                    <feature.component />
                </div>
            </div>
        );
    };

    const FeaturesRoutes = featuresDefinition.map((feature) => (
        <Route
            key={feature.name + " route"}
            path={feature.routeName}
            element={<ProtectedRoute path={"/admin/" + feature.routeName} child={featureComponent(feature)} />}
        />
    ));

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route
                    path="login"
                    element={
                        <authService.LoginFormComponent
                            redirectionPathIfSuccess="/admin/board"
                            title="Connexion administrateur"
                            displayAccountCreationLink={false}
                        />
                    }
                ></Route>
                <Route
                    path="board"
                    element={
                        <ProtectedRoute
                            path="/admin/board"
                            child={<AdminBoard featuresDefinition={featuresDefinition} />}
                        />
                    }
                />

                {FeaturesRoutes}
                <Route path="" element={<Navigate to="/admin/board" replace />} />
            </Routes>
        </Suspense>
    );
}
