import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials not configured. Database features will be unavailable."
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Guardar análisis en base de datos
 */
export async function saveAnalysis(userId, analysis, input) {
  if (!supabase) {
    console.warn("Supabase not configured");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("analyses")
      .insert([
        {
          user_id: userId,
          input,
          risk_level: analysis.detected_risk,
          categories: analysis.categories_detected,
          recommendations: analysis.recommendations,
          summary: analysis.summary,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error("Error saving analysis:", error);
    return null;
  }
}

/**
 * Obtener análisis históricos de un usuario
 */
export async function getUserAnalyses(userId, limit = 20) {
  if (!supabase) {
    console.warn("Supabase not configured");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return [];
  }
}

/**
 * Obtener estadísticas del usuario
 */
export async function getUserStats(userId) {
  if (!supabase) {
    console.warn("Supabase not configured");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("risk_level")
      .eq("user_id", userId);

    if (error) throw error;

    const stats = {
      total_analyses: data?.length || 0,
      high_risk: data?.filter((a) => a.risk_level === "High Risk").length || 0,
      limited_risk: data?.filter((a) => a.risk_level === "Limited Risk").length || 0,
      minimal_risk: data?.filter((a) => a.risk_level === "Minimal Risk").length || 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

/**
 * Eliminar un análisis
 */
export async function deleteAnalysis(analysisId) {
  if (!supabase) {
    console.warn("Supabase not configured");
    return false;
  }

  try {
    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", analysisId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return false;
  }
}
