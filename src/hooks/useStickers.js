import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { TEAMS, SPECIAL_SECTIONS, buildStickersFromTeams, buildSpecialStickers } from '../lib/stickersData'

const TEAM_STICKERS    = buildStickersFromTeams()
const SPECIAL_STICKERS = buildSpecialStickers()
const ALL_STICKERS     = [...SPECIAL_STICKERS, ...TEAM_STICKERS]

export function useStickers() {
  const { user } = useAuth()
  const [collection, setCollection] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (user) loadCollection() }, [user])

  async function loadCollection() {
    setLoading(true)
    const { data, error } = await supabase
      .from('stickers').select('sticker_code, quantity').eq('user_id', user.id)
    if (!error && data) {
      const map = {}
      data.forEach(r => { map[r.sticker_code] = r.quantity })
      setCollection(map)
    }
    setLoading(false)
  }

  const updateSticker = useCallback(async (code, quantity) => {
    if (!user) return
    setSaving(true)
    const prev = { ...collection }
    setCollection(c => ({ ...c, [code]: quantity }))
    const { error } = await supabase.from('stickers').upsert(
      { user_id: user.id, sticker_code: code, quantity },
      { onConflict: 'user_id,sticker_code' }
    )
    if (error) { console.error(error); setCollection(prev) }
    setSaving(false)
  }, [user, collection])

  const markOwned      = useCallback((code) => { if ((collection[code] || 0) === 0) updateSticker(code, 1) }, [collection, updateSticker])
  const addDuplicate   = useCallback((code) => updateSticker(code, (collection[code] || 0) + 1), [collection, updateSticker])
  const removeDuplicate= useCallback((code) => { if ((collection[code] || 0) > 0) updateSticker(code, (collection[code] || 0) - 1) }, [collection, updateSticker])

  const stats = {
    total:      ALL_STICKERS.length,
    owned:      ALL_STICKERS.filter(s => (collection[s.code] || 0) > 0).length,
    duplicates: ALL_STICKERS.filter(s => (collection[s.code] || 0) > 1)
                  .reduce((a, s) => a + (collection[s.code] - 1), 0),
    missing:    ALL_STICKERS.filter(s => (collection[s.code] || 0) === 0).length,
    percent:    Math.round(ALL_STICKERS.filter(s => (collection[s.code] || 0) > 0).length / ALL_STICKERS.length * 100),
  }

  const getTeamStats = (teamCode) => {
    const ts = TEAM_STICKERS.filter(s => s.team === teamCode)
    const owned = ts.filter(s => (collection[s.code] || 0) > 0).length
    return { total: ts.length, owned, percent: Math.round(owned / ts.length * 100) }
  }

  const getSpecialStats = (sectionCode) => {
    const ss = SPECIAL_STICKERS.filter(s => s.team === sectionCode)
    const owned = ss.filter(s => (collection[s.code] || 0) > 0).length
    return { total: ss.length, owned, percent: Math.round(owned / ss.length * 100) }
  }

  const getDuplicatesList = () =>
    ALL_STICKERS
      .filter(s => (collection[s.code] || 0) > 1)
      .map(s => ({ ...s, qty: collection[s.code], extras: collection[s.code] - 1 }))

  const getMissingList = () =>
    ALL_STICKERS.filter(s => (collection[s.code] || 0) === 0)

  return {
    collection, loading, saving,
    markOwned, addDuplicate, removeDuplicate,
    stats, getTeamStats, getSpecialStats, getDuplicatesList, getMissingList,
    TEAMS, SPECIAL_SECTIONS,
  }
}
