'use client';

import { Settings, Tags, CarFront, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarcasTab } from '@/components/admin/parametros/marcas-tab';
import { ModelosTab } from '@/components/admin/parametros/modelos-tab';
import { GeneralParamsTab } from '@/components/admin/parametros/general-params-tab';

export default function ParametrosPage() {
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Settings className="h-8 w-8 text-[#0188c8]" />
                        Configuración
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gestiona los catálogos del sistema
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="marcas" className="w-full">
                <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                    <TabsTrigger value="marcas" className="gap-2">
                        <Tags className="h-4 w-4" />
                        Marcas
                    </TabsTrigger>
                    <TabsTrigger value="modelos" className="gap-2">
                        <CarFront className="h-4 w-4" />
                        Modelos
                    </TabsTrigger>
                    <TabsTrigger value="varios" className="gap-2">
                        <List className="h-4 w-4" />
                        Varios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="marcas">
                    <MarcasTab />
                </TabsContent>

                <TabsContent value="modelos">
                    <ModelosTab />
                </TabsContent>

                <TabsContent value="varios">
                    <GeneralParamsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
