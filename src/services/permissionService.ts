import axiosInstance from '@/lib/axios'
import {
  Permission,
  PermissionApiResponse,
  Role,
  RoleApiResponse,
  GivePermissionToRolePayload,
  RevokePermissionFromRolePayload,
  GivePermissionToUserPayload,
  RevokePermissionFromUserPayload,
} from '@/types/permissions'

class PermissionService {
  private baseUrl = '/permissions'
  private rolesUrl = '/roles'
  private usersUrl = '/users'

  /**
   * Récupérer toutes les permissions
   */
  async getAllPermissions(perPage: number = 400): Promise<PermissionApiResponse> {
    const params = new URLSearchParams()
    params.append('per_page', perPage.toString())

    const response = await axiosInstance.get<PermissionApiResponse>(
      `${this.baseUrl}/list/all?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer tous les rôles
   */
  async getAllRoles(perPage: number = 500): Promise<RoleApiResponse> {
    const params = new URLSearchParams()
    params.append('per_page', perPage.toString())

    const response = await axiosInstance.get<RoleApiResponse>(
      `${this.rolesUrl}/list/all?${params.toString()}`
    )
    return response.data
  }

  /**
   * Attribuer des permissions à un rôle
   */
  async givePermissionToRole(
    roleId: string,
    payload: GivePermissionToRolePayload
  ): Promise<{ status: number; message: string }> {
    const response = await axiosInstance.post(
      `${this.rolesUrl}/${roleId}/give-permission-to-role`,
      payload
    )
    return response.data
  }

  /**
   * Retirer des permissions d'un rôle
   */
  async revokePermissionFromRole(
    roleId: string,
    payload: RevokePermissionFromRolePayload
  ): Promise<{ status: number; message: string }> {
    const response = await axiosInstance.post(
      `${this.rolesUrl}/${roleId}/revoke-permission-to-role`,
      payload
    )
    return response.data
  }

  /**
   * Attribuer des permissions à un utilisateur
   */
  async givePermissionToUser(
    userId: string,
    payload: GivePermissionToUserPayload
  ): Promise<{ status: number; message: string }> {
    const response = await axiosInstance.post(
      `${this.usersUrl}/${userId}/give-permission-to-user`,
      payload
    )
    return response.data
  }

  /**
   * Retirer des permissions d'un utilisateur
   */
  async revokePermissionFromUser(
    userId: string,
    payload: RevokePermissionFromUserPayload
  ): Promise<{ status: number; message: string }> {
    const response = await axiosInstance.post(
      `${this.usersUrl}/${userId}/revoke-permission-to-user`,
      payload
    )
    return response.data
  }
}

export const permissionService = new PermissionService()

