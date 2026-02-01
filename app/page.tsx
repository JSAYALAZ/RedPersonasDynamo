"use client";
import { PersonCreateDTO } from "@/modules/persona/aplication/dto/PersonCreateDTO";
import { PersonListDTO } from "@/modules/persona/aplication/dto/PersonListDTO";
import PersonMainPage from "@/modules/persona/view/pages/PersonMainPage";
import CreatePersonButton from "@/modules/persona/view/ui/CreatePersonButton";
import CreatePersonModal from "@/modules/persona/view/ui/CreatePersonModal";
import CreateRelationButton from "@/modules/relacion/view/ui/CreateRelationButton";
import CreateRelationModal from "@/modules/relacion/view/ui/CreateRelationModal";
import useAxios from "@/src/hooks/useAxios";
import { ApiResponse, isAxiosApiError } from "@/src/types/api.types";
import ErrorPage from "@/src/ui/Error";
import Loading from "@/src/ui/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function page() {
  const [isCreatePersonOpen, setIsCreatePersonOpen] = useState(false);
  const [isCreateRelationOpen, setIsCreateRelationOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const canCreateRelation = selectedIds.length === 2;

  const [load, setLoading] = useState(false);
  const { data, error, refetch, loading } = useAxios<PersonListDTO>("/person");
  useEffect(() => {
    if (isCreatePersonOpen&& load==false){
      setIsCreatePersonOpen(false);
    }
  }, [load]);
  if (loading) return <Loading />;
  if (error) return <ErrorPage error={error} reset={refetch} />;
  if (!data) return null;

  const createUser = async (input: PersonCreateDTO) => {
    setLoading(true);
    console.log(input);
    
    try {
      const { data } = await axios.post<ApiResponse>("/api/person", input);
      if (data.success) {
        toast.success(data.message);
      }
      
      refetch();
    } catch (error) {
      if (isAxiosApiError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const createRelation = async (relationType: string) => {
    if (!canCreateRelation) return;

    const [fromId, toId] = selectedIds;

    setLoading(true);
    try {
      const { data } = await axios.post<ApiResponse>("/api/relation", {
        id1: fromId,    
        id2: toId,    
        type: relationType, 
      });

      if (data.success) toast.success(data.message);
      setIsCreateRelationOpen(false);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      if (isAxiosApiError(error)) toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PersonMainPage
        d={data}
        selectedIds={selectedIds}
        onToggleSelect={(id: string) => {
          setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= 2) return [prev[1], id]; // replace oldest
            return [...prev, id];
          });
        }}
      />

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        <CreatePersonButton openModal={setIsCreatePersonOpen} />
        <CreateRelationButton
          disabled={!canCreateRelation}
          onClick={() => setIsCreateRelationOpen(true)}
        />
      </div>
      <CreatePersonModal
        open={isCreatePersonOpen}
        onClose={() => setIsCreatePersonOpen(false)}
        onCreate={(payload) => {
          createUser(payload);
        }}
      />
      <CreateRelationModal
        open={isCreateRelationOpen}
        onClose={() => setIsCreateRelationOpen(false)}
        fromTo={selectedIds}
        onCreate={createRelation}
      />
    </>
  );
}
